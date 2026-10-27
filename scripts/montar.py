#!/usr/bin/env python3
"""Gera skills/ = skill original (vendor/) + práticas da base (complementos/) + skills próprias (proprias/).

Para cada skill de fontes.json:
  1. copia vendor/<alvo>/ para skills/<alvo>/
  2. ajusta o frontmatter (name = alvo; description da base, se definida)
  3. anexa complementos/<alvo>.md ao fim do SKILL.md (e complementos/<alvo>.prefacio.md, se existir, no início)
  4. copia complementos/<alvo>/ (references etc.) e arquivos extras
  5. grava ORIGEM.md e as licenças do projeto original
Skills de proprias/ são copiadas como estão.

Nunca edite skills/ à mão — edite complementos/ ou proprias/ e rode este script.
"""
import json, shutil, sys
from pathlib import Path

import yaml

RAIZ = Path(__file__).resolve().parent.parent
CFG = json.loads((RAIZ / "fontes.json").read_text(encoding="utf-8"))
VENDOR, COMP, PROP, SAIDA = RAIZ / "vendor", RAIZ / "complementos", RAIZ / "proprias", RAIZ / "skills"
MARCA = "<!-- skills-base:complemento -->"


def separar(md):
    if not md.startswith("---"):
        sys.exit("SKILL.md sem frontmatter")
    _, fm, corpo = md.split("---", 2)
    return yaml.safe_load(fm), corpo.lstrip("\n")


def juntar(fm, corpo):
    texto = yaml.safe_dump(fm, sort_keys=False, allow_unicode=True, width=100000).strip()
    return f"---\n{texto}\n---\n\n{corpo}"


def main():
    if SAIDA.exists():
        shutil.rmtree(SAIDA)
    SAIDA.mkdir()
    erros = []

    for s in CFG["skills"]:
        alvo, repo = s["alvo"], s["repo"]
        info = CFG["repos"][repo]
        dst = SAIDA / alvo
        shutil.copytree(VENDOR / alvo, dst)

        fm, corpo = separar((dst / "SKILL.md").read_text(encoding="utf-8"))
        fm["name"] = alvo
        if s.get("descricao"):
            fm["description"] = s["descricao"]
        elif s.get("descricao_extra"):
            fm["description"] = " ".join(str(fm["description"]).split()) + s["descricao_extra"]
        if len(fm["description"]) > 1024:
            erros.append(f"{alvo}: description com {len(fm['description'])} caracteres (máx. 1024)")

        pref = COMP / f"{alvo}.prefacio.md"
        if pref.exists():  # aviso curto que precisa vir ANTES do texto original
            corpo = f"{MARCA}\n" + pref.read_text(encoding="utf-8").strip() + "\n\n---\n\n" + corpo
        comp = COMP / f"{alvo}.md"
        if comp.exists():
            corpo = corpo.rstrip() + f"\n\n---\n\n{MARCA}\n" + comp.read_text(encoding="utf-8").strip() + "\n"
        (dst / "SKILL.md").write_text(juntar(fm, corpo), encoding="utf-8")

        if (COMP / alvo).is_dir():
            shutil.copytree(COMP / alvo, dst, dirs_exist_ok=True)
        extras = VENDOR / "_extras" / alvo
        if extras.is_dir():
            shutil.copytree(extras, dst, dirs_exist_ok=True)
        for lic in (VENDOR / "_licencas" / repo.replace("/", "_")).glob("*"):
            nome = "NOTICE" if lic.name.upper().startswith("NOTICE") else "LICENSE"
            shutil.copy2(lic, dst / (nome if not (dst / nome).exists() else f"{nome}.upstream"))

        original = s.get("original", alvo)
        (dst / "ORIGEM.md").write_text(
            f"# Origem\n\n"
            f"- Baseada em **`{original}`** de [{repo}](https://github.com/{repo}/tree/{info['commit']}/{s['caminho']})\n"
            f"- Commit: `{info['commit']}`\n"
            f"- Licença do original: {info['licenca']} · Estrelas do repositório: {info['estrelas']}\n"
            f"- Modificações (skills-base): nome/descrição do frontmatter"
            + (" e seção de complemento com as práticas da base (trechos marcados com `skills-base:complemento`)" if comp.exists() else "")
            + ".\n- O texto original está intacto em `vendor/" + alvo + "/` deste repositório.\n",
            encoding="utf-8",
        )
        print(f"+ {alvo:32} {'(+complemento)' if comp.exists() else ''}")

    for p in sorted(PROP.iterdir()):
        if p.is_dir():
            shutil.copytree(p, SAIDA / p.name)
            print(f"+ {p.name:32} (própria)")

    if erros:
        sys.exit("\n".join(erros))


if __name__ == "__main__":
    main()
