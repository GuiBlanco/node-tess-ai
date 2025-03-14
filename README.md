# n8n Tess AI Node

Este é um nó customizado para n8n que permite a integração com a API da Tess AI.

## Funcionalidades

Este nó oferece suporte para as seguintes operações da API Tess AI:

*   **Agentes:**
    *   Listar Agentes
    *   Obter Agente
    *   Executar Agente
    *   Executar Agent Stream
    *   Executar Compatível com OpenAI
    *   Obter Resposta do Agente
*   **Arquivos de Agente:**
    *   Listar Arquivos de Agente
    *   Linkar Arquivos ao Agente
    *   Deletar Arquivo de Agente
*   **Webhooks de Agente:**
    *   Listar Webhooks de Agente
    *   Criar Webhook de Agente
*   **Arquivos:**
    *   Listar Arquivos
    *   Upload de Arquivo
    *   Obter Arquivo
    *   Deletar Arquivo
    *   Processar Arquivo
*   **Webhooks:**
    *   Listar Webhooks
    *   Deletar Webhook

## Pré-requisitos

*   Uma instância n8n instalada.
*   Uma conta na Tess AI e uma API Key válida.

## Instalação

1.  Copie a pasta `n8n-nodes-tessai` para o diretório de nós customizados do seu n8n, geralmente localizado em `~/.n8n/custom/nodes`.
2.  Reinicie o n8n.

## Uso

1.  Na sua instância n8n, adicione o nó "Tess AI" ao seu workflow.
2.  Configure as credenciais "Tess AI API" com sua API Key da Tess AI.
3.  Selecione o Recurso e a Operação desejada.
4.  Preencha os parâmetros necessários para a operação.

## Suporte

Para suporte ou para relatar problemas, por favor, abra uma issue neste repositório ou entre em contato com [seu email/link para suporte].

## Licença

[Licença MIT ou a licença que você escolher]
