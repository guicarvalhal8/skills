# LGPD — o mínimo técnico

> Não é aconselhamento jurídico; é o que o código precisa suportar.

## Ao desenhar
- Liste os dados pessoais coletados e **para quê** cada um (finalidade). Sem finalidade → não colete.
- Dado sensível (saúde, biometria, religião, orientação, etc.) exige base legal específica — evite coletar.
- Defina retenção: por quanto tempo cada dado fica e o que acontece depois (apagar/anonimizar).

## No sistema
- [ ] Página de política de privacidade e termos, com contato do responsável (encarregado/DPO)
- [ ] Consentimento registrado (quem, quando, versão do texto) quando a base legal for consentimento — ex.: marketing por WhatsApp/e-mail
- [ ] Opt-out fácil de comunicações
- [ ] Exportar dados do titular (JSON/CSV) e excluir conta de verdade (incluindo backups no ciclo de retenção)
- [ ] Logs e analytics sem dado pessoal desnecessário (mascarar telefone/CPF: `***.***.789-00`)
- [ ] Acesso a dados pessoais restrito por papel e auditado
- [ ] Terceiros que recebem dados (provedor de LLM, e-mail, CRM) listados na política
- [ ] Plano de incidente: quem avisa, como, em quanto tempo

## Prospecção / disparo de mensagens
- Base de contatos precisa de origem legítima; mantenha lista de descadastro e respeite-a em todo disparo.
