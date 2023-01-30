import {
  Checkbox, Dialog,
  FormControl, FormControlLabel, FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import useCarregarSecretarias from "./function/useCarregarSecretarias";
import {SecretariaEntity} from "./entity/SecretariaEntity";
import InputArquivo from "./component/InputArquivo";
import {CadastroEntity} from "./entity/CadastroEntity";
import InputArquivos from "./component/InputArquivos";
import MaskedInput from "react-text-mask";
import {useSnackbar} from "notistack";
import useEnviarFormulario from "./function/useEnviarFormulario";
import {LoadingButton} from "@mui/lab";

function App() {
  const [cadastro, setCadastro] = useState<CadastroEntity>({
    cpf: '',
    nome: '',
    secretaria_uuid: '',
    contato: '',
    arquivo_identidade: null,
    arquivo_cpf: null,
    arquivo_titulo: null,
    arquivo_quitacao: null,
    arquivo_residencia: null,
    arquivo_ct: null,
    arquivos_filhos: null,
  });
  const [aceite, setAceite] = useState(false);
  const [naoPossuoFilhos, setNaoPossuoFilhos] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [uuid, setUuid] = useState('');
  const secretarias = useCarregarSecretarias();
  const enviarFormulario = useEnviarFormulario();
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (secretarias.data && cadastro.secretaria_uuid === '') {
      setCadastro({...cadastro, secretaria_uuid: secretarias.data[0].uuid});
    }
  }, [secretarias]);
  
  const validarCPF = (): boolean => {
    let cpf = cadastro.cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
    return true;
  }
  
  const handleEnviar = () => {
    if (!aceite) {
      enqueueSnackbar("Para enviar os termos precisam ser aceitos", {variant: "warning"});
    } else if (!naoPossuoFilhos && cadastro.arquivos_filhos == null) {
      enqueueSnackbar("Caso não possua filhos, marque a caixa 'Não possuo filhos'. Caso contrario anexe os arquivos", {variant: "warning"});
    } else if (!validarCPF()) {
      enqueueSnackbar("CPF Inválido", {variant: "warning"});
    } else if (cadastro.nome === '') {
      enqueueSnackbar("Nome deve ser preenchido", {variant: "warning"});
    } else if (cadastro.contato === '') {
      enqueueSnackbar("Telefone deve ser preenchido", {variant: "warning"});
    } else if (cadastro.arquivo_identidade == null) {
      enqueueSnackbar("Carteira de Identidade deve ser anexado", {variant: "warning"});
    } else if (cadastro.arquivo_cpf == null) {
      enqueueSnackbar("CPF deve ser anexado", {variant: "warning"});
    } else if (cadastro.arquivo_titulo == null) {
      enqueueSnackbar("Título de Eleitor deve ser anexado", {variant: "warning"});
    } else if (cadastro.arquivo_quitacao == null) {
      enqueueSnackbar("Comprovante de votação ou certidão de quitação deve ser anexado", {variant: "warning"});
    } else if (cadastro.arquivo_residencia == null) {
      enqueueSnackbar("Comprovante de residência deve ser anexado", {variant: "warning"});
    } else if (cadastro.arquivo_ct == null) {
      enqueueSnackbar("Carteira de trabalho deve ser anexado", {variant: "warning"});
    } else if (cadastro.arquivo_identidade.name.length > 200) {
      enqueueSnackbar("Identidade: Nome do arquivo muito grande", {variant: "warning"});
    }
    else {
      let form = new FormData();
      
      console.log(cadastro.arquivo_identidade.name.split('.').pop());
      
      form.append('cpf', cadastro.cpf);
      form.append('nome', cadastro.nome);
      form.append('secretaria_uuid', cadastro.secretaria_uuid);
      form.append('contato', cadastro.contato);
      form.append('arquivo_identidade', new File([cadastro.arquivo_identidade.slice()], 'RG.' + cadastro.arquivo_identidade.name.split('.').pop(), {type: cadastro.arquivo_identidade.type}));
      form.append('arquivo_cpf', new File([cadastro.arquivo_cpf.slice()], 'CPF.' + cadastro.arquivo_cpf.name.split('.').pop(), {type: cadastro.arquivo_cpf.type}));
      form.append('arquivo_titulo', new File([cadastro.arquivo_titulo.slice()], 'Titulo.' + cadastro.arquivo_titulo.name.split('.').pop(), {type: cadastro.arquivo_titulo.type}));
      form.append('arquivo_quitacao', new File([cadastro.arquivo_quitacao.slice()], 'Quitacao.' + cadastro.arquivo_quitacao.name.split('.').pop(), {type: cadastro.arquivo_quitacao.type}));
      form.append('arquivo_residencia', new File([cadastro.arquivo_residencia.slice()], 'Residencia.' + cadastro.arquivo_residencia.name.split('.').pop(), {type: cadastro.arquivo_residencia.type}));
      form.append('arquivo_ct', new File([cadastro.arquivo_ct.slice()], 'CT.' + cadastro.arquivo_ct.name.split('.').pop(), {type: cadastro.arquivo_ct.type}));
      
      if (cadastro.arquivos_filhos !== null) {
        for (let i = 0; i < cadastro.arquivos_filhos.length; i++) {
          form.append(`arquivo_filho_${i}`, cadastro.arquivos_filhos[i]);
        }
      }
      setLoading(true);
      enviarFormulario(form)
        .then((response) => {
          setDialog(true);
          setUuid(response.data.uuid);
          enqueueSnackbar("Sucesso!", {variant: "success"});
        })
        .catch((error) => {
          enqueueSnackbar(error.response.data, {variant: "error"});
        })
        .finally(() => {
          setLoading(false);
        })
      ;
    }
  }
  
  return (
    <>
      <Paper elevation={3} sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        marginTop: "30px",
        marginBottom: "30px"
      }}>
        <Grid container spacing={1} sx={{justifyContent: "center"}}>
          <Grid item xs={12} md={8}>
            <Typography fontSize={30} align={"center"}>
              Recadastramento de Servidor
            </Typography>
            <Typography fontSize={25}>
              Informações básicas
            </Typography>
            
            <MaskedInput
              mask={[/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/]}
              placeholderChar={"_"}
              onChange={(e) => {
                setCadastro({...cadastro, cpf: e.target.value})
              }}
              render={(ref, props) => (
                <TextField
                  {...props}
                  margin={"normal"}
                  inputRef={ref}
                  fullWidth
                  variant={"outlined"}
                  label={"CPF"}
                  autoFocus
                  value={cadastro.cpf}
                />
              )}
              guide
              keepCharPositions
            />
            
            <TextField
              margin={"normal"}
              fullWidth
              variant={"outlined"}
              label={"Nome"}
              value={cadastro.nome}
              onChange={(t) => {
                setCadastro({...cadastro, nome: t.target.value})
              }}
            />
            
            <FormControl
              fullWidth
              margin={"normal"}
            >
              <InputLabel id="secretaria-label">Secretaria</InputLabel>
              <Select
                labelId="secretaria-label"
                id="secretaria-select"
                value={cadastro.secretaria_uuid}
                label="Secretaria"
                onChange={(t) => {
                  setCadastro({...cadastro, secretaria_uuid: t.target.value});
                }}
              >
                {secretarias.data && secretarias.data.map((secretaria: SecretariaEntity) => (
                  <MenuItem key={secretaria.uuid} value={secretaria.uuid}>{secretaria.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <MaskedInput
              mask={["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
              placeholderChar={"_"}
              onChange={(t) => {
                setCadastro({...cadastro, contato: t.target.value})
              }}
              render={(ref, props) => (
                <TextField
                  {...props}
                  margin={"normal"}
                  inputRef={ref}
                  fullWidth
                  variant={"outlined"}
                  label={"Telefone"}
                  value={cadastro.contato}
                />
              )}
              guide
              keepCharPositions
            />
          </Grid>
          
          <Grid item xs={12} md={8} sx={{marginTop: "20px"}}>
            <Typography fontSize={25}>
              Arquivos
            </Typography>
            <InputArquivo
              label={"Carteira de Identidade"}
              arquivo={cadastro.arquivo_identidade}
              onChange={(e) => {
                setCadastro({...cadastro, arquivo_identidade: e})
              }}
            />
            
            <InputArquivo
              label={"CPF"}
              arquivo={cadastro.arquivo_cpf}
              onChange={(e) => {
                setCadastro({...cadastro, arquivo_cpf: e})
              }}
            />
            
            <InputArquivo
              label={"Título de Eleitor"}
              arquivo={cadastro.arquivo_titulo}
              onChange={(e) => {
                setCadastro({...cadastro, arquivo_titulo: e})
              }}
            />
            
            <InputArquivo
              label={"Comprovante de votação atual ou Certidão de Quitação Eleitoral"}
              arquivo={cadastro.arquivo_quitacao}
              onChange={(e) => {
                setCadastro({...cadastro, arquivo_quitacao: e})
              }}
            />
            
            <InputArquivo
              label={"Comprovante de Residência Atual"}
              arquivo={cadastro.arquivo_residencia}
              onChange={(e) => {
                setCadastro({...cadastro, arquivo_residencia: e})
              }}
            />
            
            <InputArquivo
              label={"Inscrição do PIS ou PASEP"}
              arquivo={cadastro.arquivo_ct}
              onChange={(e) => {
                setCadastro({...cadastro, arquivo_ct: e})
              }}
            />
            
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={naoPossuoFilhos}
                    onClick={() => {
                      setNaoPossuoFilhos(!naoPossuoFilhos);
                    }}
                    name="Filhos"/>
                }
                label="Não possuo filho(s)."
              />
            </FormControl>
            {!naoPossuoFilhos &&
              <>
                <Typography>
                  ATENÇÃO: Neste campo você deverá selecionar mais de um arquivo.
                </Typography>
                <Typography>
                  Deverá selecionar: Certidão de Nascimento ou RG e CPF (dos filhos), carteira de vacinação (para
                  crianças
                  menores de 7
                  anos), no caso de crianças a partir de 7 anos, declaração escolar.
                </Typography>
                <InputArquivos
                  label={"Arquivos do(s) filho(s)"}
                  arquivos={cadastro.arquivos_filhos}
                  onChange={(e) => {
                    setCadastro({...cadastro, arquivos_filhos: e})
                  }}
                />
              </>
            }
            
            <FormControl sx={{marginTop: "30px"}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={aceite}
                    onClick={() => {
                      setAceite(!aceite);
                    }}
                    name="LGPD"/>
                }
                label="Estou de acordo com o envio dos meus documentos e estou ciente que a Prefeitura Municipal de Itabaiana segue diretrizes de privacidade para a utilização das informações fornecidas."
              />
              {!aceite && <FormHelperText sx={{color: "red"}}>É necessário concordar com os termos para submeter os seus
                dados</FormHelperText>}
            </FormControl>
            
            <LoadingButton
              variant={"contained"}
              fullWidth
              loading={loading}
              sx={{marginTop: "15px", padding: "15px"}}
              size={"large"}
              onClick={handleEnviar}
            >
              Enviar
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={dialog}
        PaperProps={{
          sx: {
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "60%",
            maxWidth: "90%"
          }
        }}
        onClose={() => {
          window.location.replace(`${import.meta.env.VITE_BASE_URL}`)
        }}
      >
        <Typography fontSize={30} align={"center"}>
          Obrigado, sua documentação foi enviada com sucesso.
        </Typography>
        <Typography fontSize={24} align={"center"} sx={{marginTop: "15px"}}>
          A identificação do seu protocolo é:
        </Typography>
        <Typography fontSize={24} fontWeight={600} align={"center"}>
          PMI-{uuid}
        </Typography>
      </Dialog>
    </>
  )
}

export default App
