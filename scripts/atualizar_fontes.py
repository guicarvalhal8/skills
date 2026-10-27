#!/usr/bin/env python3
"""Baixa as skills de terceiros listadas em fontes.json para vendor/<alvo> (cópia intacta).

Uso:
  python3 scripts/atualizar_fontes.py              # usa os commits fixados em fontes.json
  python3 scripts/atualizar_fontes.py --ultima     # puxa a versão mais nova e atualiza os commits
  python3 scripts/atualizar_fontes.py --local DIR  # usa clones já existentes em DIR/<dono>_<repo>

Depois rode: python3 scripts/montar.py
Revise o diff de vendor/ antes de commitar — conteúdo de terceiros é tratado como não confiável.
Nenhum script baixado é executado.
"""
import argparse, json, shutil, subprocess, sys, tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FONTES = RAIZ / "fontes.json"
VENDOR = RAIZ / "vendor"


def git(*args, cwd=None):
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True, text=True).stdout.strip()


def obter_repo(repo, commit, ultima, local, tmp):
    if local:
        d = Path(local) / repo.replace("/", "_")
        if not d.is_dir():
            sys.exit(f"clone local não encontrado: {d}")
        return d, git("rev-parse", "HEAD", cwd=d)
    d = Path(tmp) / repo.replace("/", "_")
    url = f"https://github.com/{repo}"
    if ultima:
        git("clone", "-q", "--depth", "1", url, str(d))
    else:
        d.mkdir(parents=True)
        git("init", "-q", cwd=d)
        git("fetch", "-q", "--depth", "1", url, commit, cwd=d)
        git("checkout", "-q", "FETCH_HEAD", cwd=d)
    return d, git("rev-parse", "HEAD", cwd=d)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ultima", action="store_true")
    ap.add_argument("--local")
    a = ap.parse_args()

    cfg = json.loads(FONTES.read_text(encoding="utf-8"))
    with tempfile.TemporaryDirectory() as tmp:
        clones = {}
        for repo, info in cfg["repos"].items():
            d, sha = obter_repo(repo, info["commit"], a.ultima, a.local, tmp)
            clones[repo] = d
            if sha != info["commit"]:
                print(f"~ {repo}: {info['commit'][:8]} -> {sha[:8]}")
                info["commit"] = sha
            lic_dst = VENDOR / "_licencas" / repo.replace("/", "_")
            shutil.rmtree(lic_dst, ignore_errors=True)
            lic_dst.mkdir(parents=True)
            for f in info.get("arquivos_licenca", []):
                shutil.copy2(d / f, lic_dst / Path(f).name)
            if info.get("nota_licenca"):  # repo sem arquivo de licença: registra a licença declarada
                (lic_dst / "LICENSE").write_text(info["nota_licenca"], encoding="utf-8")

        for s in cfg["skills"]:
            src = clones[s["repo"]] / s["caminho"]
            dst = VENDOR / s["alvo"]
            shutil.rmtree(dst, ignore_errors=True)
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns(".git", "*.zip", "node_modules"))
            for origem, destino in s.get("extras", []):
                alvo = VENDOR / "_extras" / s["alvo"] / destino
                alvo.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(clones[s["repo"]] / origem, alvo)
            print(f"+ {s['alvo']:32} <- {s['repo']}/{s['caminho']}")

    FONTES.write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("\nPronto. Revise `git diff vendor/` e rode: python3 scripts/montar.py")


if __name__ == "__main__":
    main()
