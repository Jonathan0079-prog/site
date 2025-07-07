# -*- coding: utf-8 -*-

def calcular_furo_rolamento(especificacao):
    """
    Calcula o diâmetro do furo de um rolamento com base nos dois últimos
    dígitos de sua especificação, seguindo o padrão ISO 15.

    Args:
        especificacao (str): A especificação completa do rolamento (ex: "6205", "22310").

    Returns:
        str: Uma string descrevendo o diâmetro do furo ou uma mensagem de erro.
    """
    # Validação de entrada: verifica se a especificação tem pelo menos 2 caracteres.
    if not isinstance(especificacao, str) or len(especificacao) < 2:
        return "Erro: A especificação do rolamento deve ser um texto com pelo menos 2 caracteres."

    try:
        # Pega os dois últimos caracteres da especificação.
        codigo_furo_str = especificacao[-2:]
        
        # Converte os dois últimos caracteres para um número inteiro.
        codigo_furo_int = int(codigo_furo_str)

        # Aplica as regras padrão da ISO
        if codigo_furo_int == 0:
            return f"Rolamento '{especificacao}': Furo de 10 mm (código 00)."
        elif codigo_furo_int == 1:
            return f"Rolamento '{especificacao}': Furo de 12 mm (código 01)."
        elif codigo_furo_int == 2:
            return f"Rolamento '{especificacao}': Furo de 15 mm (código 02)."
        elif codigo_furo_int == 3:
            return f"Rolamento '{especificacao}': Furo de 17 mm (código 03)."
        elif 4 <= codigo_furo_int <= 96:
            diametro = codigo_furo_int * 5
            return f"Rolamento '{especificacao}': Furo de {diametro} mm (código {codigo_furo_str})."
        else:
            # Para códigos acima de 96, que são incomuns ou seguem outras regras.
            return f"Código '{codigo_furo_str}' não segue a regra padrão de multiplicação. Verifique o catálogo do fabricante."

    except ValueError:
        # Caso os dois últimos caracteres não sejam números (ex: "620A").
        return f"Erro: Os dois últimos caracteres da especificação ('{especificacao[-2:]}') devem ser numéricos."
    except Exception as e:
        # Captura qualquer outro erro inesperado.
        return f"Ocorreu um erro inesperado: {e}"

# Loop principal para manter o programa em execução
if __name__ == "__main__":
    print("--- Calculadora de Furo de Rolamentos ---")
    print("Digite a especificação do rolamento (ex: 6204, 22220) ou 'sair' para fechar.")
    
    while True:
        entrada_usuario = input("\nDigite a especificação do rolamento: ")
        
        if entrada_usuario.lower() == 'sair':
            print("Encerrando o programa. Até mais!")
            break
            
        resultado = calcular_furo_rolamento(entrada_usuario)
        print(resultado)
