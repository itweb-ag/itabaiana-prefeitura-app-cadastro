import {Button, TextField} from "@mui/material";
import {ChangeEvent, createRef, useEffect, useState} from "react";

type Args = {
  label: string,
  arquivo: File|null,
  onChange(e: File|null): void
}

export const InputArquivo = ({label, arquivo, onChange}: Args) => {
  const [nomeArquivo, setNomeArquivo] = useState('');
  const inputRef = createRef<HTMLInputElement>();
  
  const handleInputChange = (e: any) => {
    if (e.target.files.length > 0) {
      onChange(e.target.files[0]);
    } else {
      onChange(null);
    }
  }
  
  useEffect(() => {
    if (arquivo) {
      setNomeArquivo(arquivo.name);
    } else {
      setNomeArquivo('');
    }
  }, [arquivo]);
  
  return (
    <div style={{display: "inline-flex", width: "100%", marginTop: "16px", marginBottom: "8px"}}>
      <input ref={inputRef} onChange={handleInputChange} type={"file"} style={{display: "none"}}/>
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
export default InputArquivo;