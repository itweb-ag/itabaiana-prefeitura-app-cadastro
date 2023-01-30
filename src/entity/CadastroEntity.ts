export type CadastroEntity = {
  cpf: string,
  nome: string,
  secretaria_uuid: string,
  contato: string,
  arquivo_identidade: File|null
  arquivo_cpf: File|null,
  arquivo_titulo: File|null,
  arquivo_quitacao: File|null,
  arquivo_residencia: File|null,
  arquivo_ct: File|null,
  arquivos_filhos: FileList|null,
}