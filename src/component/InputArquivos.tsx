import {Button, TextField} from "@mui/material";
import {ChangeEvent, createRef, useEffect, useState} from "react";

type Args = {
  label: string,
  arquivos: FileList|null,
  onChange(e: FileList|null): void
}

export const InputArquivos = ({label, arquivos, onChange}: Args) => {
  const [nomeArquivo, setNomeArquivo] = useState('');
  const inputRef = createRef<HTMLInputElement>();
  
  const handleInputChange = (e: any) => {
    if (e.target.files.length > 0) {
      onChange(e.target.files);
    } else {
      onChange(null);
    }
  }
  
  useEffect(() => {
    if (arquivos && arquivos.length > 0) {
      let tmpNome = '';
      for (let i = 0; i < arquivos.length; i++) {
        tmpNome += `${arquivos[i].name}, `;
      }
      setNomeArquivo(tmpNome);
    } else {
      setNomeArquivo('');
    }
  }, [arquivos]);
  
  return (
    <div style={{display: "inline-flex", width: "100%", marginTop: "16px", marginBottom: "8px"}}>
      <input ref={inputRef} multiple onChange={handleInputChange} type={"file"} style={{display: "none"}}/>
      <TextField
        disabled
        label={label}
        value={nomeArquivo}
        sx={{width: "calc(80% - 10px)"}}
      />
      <Button
        variant={"contained"}
        sx={{width: "20%", marginLeft: "10px"}}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Buscar...
      </Button>
    </div>
  )
}
export default InputArquivos;