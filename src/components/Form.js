import React, {useState} from 'react';
import { useForm } from 'react-hook-form';

const Form = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm({
        defaultValues: {
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            localidade: '',
            uf: ''
        },
        reValidateMode: 'onSubmit'
    });


    function displayData(data) {
        for (const key in data) {
            if (document.getElementById(key)) {
                setValue(key, data[key])
                document.getElementById(key).value = data[key]
            }
        }
    }

    const [validationResult, setValidationResult] = useState(false);

    function getAddress(value) {

        if (value.length < 9) {
            return;
        }

        value = value.replace('-', "");
        const options = {
            method: "GET",
            mode: "cors",
            cache: "default"
        };

        fetch(`https://viacep.com.br/ws/${value}/json/`, options)
            .then(res => {
                res.json().then(data => {
                    if (data.erro) {
                        throw ("CEP Invalido");
                    }
                    setValidationResult(true);
                    displayData(data);
                }).catch(e => {
                    console.error(e);
                    setValidationResult(false)
                })
            })
            .catch(e => {
                console.error(e)
                setValidationResult(false)
            });
    };
    return (
        <div className="container">
            <h1>Busca CEP</h1>

            <form onSubmit={handleSubmit((data) => {
                console.log(data);
            })}>
                <div className="form-group pb-3">
                    <label htmlFor="cep">CEP</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cep"
                        {...register("cep", {
                            required: "Cep Obrigátorio",
                            minLength: {
                                value: 9,
                                message: "CEP Incompleto"
                            },
                            onChange: (e) => {
                                clearErrors('cep');
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .replace(/(\d{5})(\d{1})/, "$1-$2")
                                    .replace(/(-\d{3})\d+?$/, "$1")
                            },
                            onBlur: (e) => {
                                getAddress(e.target.value)
                            },
                            validate: () => validationResult || "Cep inválido"
                        })}
                    />
                    <span className="text-danger">{errors.cep?.message}</span>
                </div>

                <div className="form-group pb-3">
                    <label htmlFor="logradouro">Logradouro</label>
                    <input
                        type="text"
                        className="form-control"
                        id="logradouro"
                        {...register("logradouro", {
                            required: "Logradouro Obrigatório"
                        })}
                    />
                    <span className="text-danger">{errors.logradouro?.message}</span>
                </div>

                <div className="form-group pb-3">
                    <label htmlFor="numero">Número</label>
                    <input
                        type="text"
                        className="form-control"
                        id="numero"
                        {...register("numero", {
                            required: "Numero Obrigatório",
                            onChange: (e) => {
                                e.target.value = e.target.value.replace(/\D/g, "")
                            }
                        })}
                    />
                    <span className="text-danger">{errors.numero?.message}</span>
                </div>

                <div className="form-group pb-3">
                    <label htmlFor="complemento">Complemento</label>
                    <input
                        type="text"
                        className="form-control"
                        id="complemento"
                        {...register("complemento")}
                    />
                </div>

                <div className="form-group pb-3">
                    <label htmlFor="bairro">Bairro</label>
                    <input
                        type="text"
                        className="form-control"
                        id="bairro"
                        {...register("bairro", {
                            required: "Bairro Obrigatório"
                        })}
                    />
                    <span className="text-danger">{errors.bairro?.message}</span>
                </div>

                <div className="form-group pb-3">
                    <label htmlFor="localidade">Cidade</label>
                    <input
                        type="text"
                        className="form-control"
                        id="localidade"
                        {...register("localidade", {
                            required: "Cidade Obrigatório"
                        })}
                    />
                    <span className="text-danger">{errors.localidade?.message}</span>
                </div>

                <div className="form-group pb-3">
                    <label htmlFor="uf">Estado</label>
                    <input
                        type="text"
                        className="form-control"
                        id="uf"
                        {...register("uf", {
                            required: "Estado Obrigatório"
                        })}
                    />
                    <span className="text-danger">{errors.uf?.message}</span>
                </div>
                
                <input type="submit"/>
            </form>
        </div>
    );
};

export default Form;