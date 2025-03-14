const { NodeOperationError } = require('n8n-workflow');
const axios = require('axios');
const FormData = require('form-data');

class TessAi {
  constructor() {
    this.description = {
      displayName: 'Tess AI',
      name: 'tessAi',
      icon: 'file:tessai.svg',
      group: ['transform'],
      version: 1,
      description: 'Integrate with Tess AI API - Full Functionality based on documentation',
      defaults: {
        name: 'Tess AI',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [
        {
          name: 'tessAiApi',
          required: true,
          type: 'credentials',
          displayOptions: {
            show: {
              authentication: [
                'apiKey',
              ],
            },
          },
          properties: [
            {
              displayName: 'Authentication',
              name: 'authentication',
              type: 'options',
              options: [
                {
                  name: 'API Key',
                  value: 'apiKey',
                },
              ],
              default: 'apiKey',
              description: 'Authentication method',
            },
            {
              displayName: 'API Key',
              name: 'apiKey',
              type: 'string',
              default: '',
              description: 'Your Tess AI API Key',
              displayOptions: {
                show: {
                  authentication: [
                    'apiKey',
                  ],
                },
              },
            },
          ],
        },
      ],
      properties: [
        {
          displayName: 'Resource',
          name: 'resource',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'Agent',
              value: 'agent',
            },
            {
              name: 'Agent File',
              value: 'agentFile',
            },
            {
              name: 'Agent Webhook',
              value: 'agentWebhook',
            },
            {
              name: 'File',
              value: 'file',
            },
            {
              name: 'Webhook',
              value: 'webhook',
            },
          ],
          default: 'agent',
          description: 'Resource to interact with',
        },
        // --- Agent Operations ---
        {
          displayName: 'Operation',
          name: 'agentOperation',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'List Agents',
              value: 'listAgents',
              description: 'List all Tess AI Agents',
            },
            {
              name: 'Get Agent',
              value: 'getAgent',
              description: 'Get details of a specific Tess AI Agent',
            },
            {
              name: 'Execute Agent',
              value: 'executeAgent',
              description: 'Execute a Tess AI Agent',
            },
            {
              name: 'Execute Agent Stream',
              value: 'executeAgentStream',
              description: 'Execute a Tess AI Agent and stream responses',
            },
            {
              name: 'Execute OpenAI Compatible',
              value: 'executeOpenaiCompatible',
              description: 'Execute a Tess AI Agent using OpenAI compatible format',
            },
            {
              name: 'Get Agent Response',
              value: 'getAgentResponse',
              description: 'Get a specific response from an Agent execution',
            },
          ],
          default: 'listAgents',
          description: 'Operation to perform on Agent',
          displayOptions: {
            show: {
              resource: [
                'agent',
              ],
            },
          },
        },
        // --- Agent File Operations ---
        {
          displayName: 'Operation',
          name: 'agentFileOperation',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'List Agent Files',
              value: 'listAgentFiles',
              description: 'List files linked to a Tess AI Agent',
            },
            {
              name: 'Link Files to Agent',
              value: 'linkFilesToAgent',
              description: 'Link existing files to a Tess AI Agent',
            },
            {
              name: 'Delete Agent File',
              value: 'deleteAgentFile',
              description: 'Unlink a file from a Tess AI Agent',
            },
          ],
          default: 'listAgentFiles',
          description: 'Operation to perform on Agent File',
          displayOptions: {
            show: {
              resource: [
                'agentFile',
              ],
            },
          },
        },
        // --- Agent Webhook Operations ---
        {
          displayName: 'Operation',
          name: 'agentWebhookOperation',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'List Agent Webhooks',
              value: 'listAgentWebhooks',
              description: 'List webhooks for a Tess AI Agent',
            },
            {
              name: 'Create Agent Webhook',
              value: 'createAgentWebhook',
              description: 'Create a new webhook for a Tess AI Agent',
            },
          ],
          default: 'listAgentWebhooks',
          description: 'Operation to perform on Agent Webhook',
          displayOptions: {
            show: {
              resource: [
                'agentWebhook',
              ],
            },
          },
        },
        // --- File Operations ---
        {
          displayName: 'Operation',
          name: 'fileOperation',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'List Files',
              value: 'listFiles',
              description: 'List all files in Tess AI',
            },
            {
              name: 'Upload File',
              value: 'uploadFile',
              description: 'Upload a file to Tess AI',
            },
            {
              name: 'Get File',
              value: 'getFile',
              description: 'Download a file from Tess AI',
            },
            {
              name: 'Delete File',
              value: 'deleteFile',
              description: 'Delete a file from Tess AI',
            },
            {
              name: 'Process File',
              value: 'processFile',
              description: 'Process a file in Tess AI',
            },
          ],
          default: 'listFiles',
          description: 'Operation to perform on File',
          displayOptions: {
            show: {
              resource: [
                'file',
              ],
            },
          },
        },
        // --- Webhook Operations ---
        {
          displayName: 'Operation',
          name: 'webhookOperation',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'List Webhooks',
              value: 'listWebhooks',
              description: 'List all webhooks in Tess AI',
            },
            {
              name: 'Delete Webhook',
              value: 'deleteWebhook',
              description: 'Delete a webhook from Tess AI',
            },
          ],
          default: 'listWebhooks',
          description: 'Operation to perform on Webhook',
          displayOptions: {
            show: {
              resource: [
                'webhook',
              ],
            },
          },
        },
        // --- Agent Operation Parameters ---
        {
          displayName: 'Agent ID',
          name: 'agentId',
          type: 'string',
          default: '',
          description: 'ID of the Tess AI Agent',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'agent',
                'agentFile',
                'agentWebhook',
              ],
              agentOperation: [
                'getAgent',
                'executeAgent',
                'executeAgentStream',
                'executeOpenaiCompatible',
                'getAgentResponse',
              ],
              agentFileOperation: [
                'listAgentFiles',
                'linkFilesToAgent',
                'deleteAgentFile',
                'listAgentWebhooks',
                'createAgentWebhook'
              ],
              agentWebhookOperation: [
                'listAgentWebhooks',
                'createAgentWebhook'
              ]
            },
          },
        },
        {
          displayName: 'Response ID',
          name: 'responseId',
          type: 'string',
          default: '',
          description: 'ID of the Agent Response',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'agent',
              ],
              agentOperation: [
                'getAgentResponse',
              ],
            },
          },
        },
        {
          displayName: 'Input Data',
          name: 'inputData',
          type: 'json',
          default: '{}',
          description: 'Input data for the Tess AI Agent in JSON format',
          displayOptions: {
            show: {
              resource: [
                'agent',
              ],
              agentOperation: [
                'executeAgent',
                'executeOpenaiCompatible',
              ],
            },
          },
        },
        {
          displayName: 'Stream Output',
          name: 'streamOutput',
          type: 'boolean',
          default: true,
          description: 'Whether to stream the output (for Execute Agent Stream)',
          displayOptions: {
            show: {
              resource: [
                'agent',
              ],
              agentOperation: [
                'executeAgentStream',
              ],
            },
          },
        },
        {
          displayName: 'OpenAI Messages',
          name: 'openaiMessages',
          type: 'json',
          default: '[]',
          description: 'Messages array in OpenAI compatible format',
          displayOptions: {
            show: {
              resource: [
                'agent',
              ],
              agentOperation: [
                'executeOpenaiCompatible',
              ],
            },
          },
        },
        // --- Agent File Operation Parameters ---
        {
          displayName: 'File IDs',
          name: 'fileIds',
          type: 'string',
          default: '',
          description: 'Comma-separated IDs of files to link/unlink',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'agentFile',
              ],
              agentFileOperation: [
                'linkFilesToAgent',
                'deleteAgentFile',
              ],
            },
          },
        },
        // --- Agent Webhook Operation Parameters ---
        {
          displayName: 'Webhook URL',
          name: 'webhookUrl',
          type: 'string',
          default: '',
          description: 'URL for the Agent Webhook',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'agentWebhook',
              ],
              agentWebhookOperation: [
                'createAgentWebhook',
              ],
            },
          },
        },
        {
          displayName: 'Events',
          name: 'webhookEvents',
          type: 'multiOptions',
          options: [
            {
              name: 'AGENT_RESPONSE_CREATED',
              value: 'AGENT_RESPONSE_CREATED',
              description: 'Triggered when a new agent response is created',
            },
            {
              name: 'AGENT_RESPONSE_UPDATED',
              value: 'AGENT_RESPONSE_UPDATED',
              description: 'Triggered when an agent response is updated',
            },
            {
              name: 'AGENT_RESPONSE_COMPLETED',
              value: 'AGENT_RESPONSE_COMPLETED',
              description: 'Triggered when an agent response is completed',
            },
          ],
          default: ['AGENT_RESPONSE_CREATED'],
          description: 'Events to trigger the webhook',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'agentWebhook',
              ],
              agentWebhookOperation: [
                'createAgentWebhook',
              ],
            },
          },
        },
        // --- File Operation Parameters ---
        {
          displayName: 'Filename',
          name: 'uploadFilename',
          type: 'string',
          default: '',
          description: 'Filename for upload',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'file',
              ],
              fileOperation: [
                'uploadFile',
              ],
            },
          },
        },
        {
          displayName: 'File Content',
          name: 'fileContent',
          type': 'string',
          default: '',
          description: 'Content of the file to upload (Base64 encoded)',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'file',
              ],
              fileOperation: [
                'uploadFile',
              ],
            },
          },
        },
        {
          displayName: 'Binary Data',
          name: 'binaryData',
          type: 'boolean',
          default: false,
          description: 'Whether to use binary data for file upload (multipart/form-data)',
          displayOptions: {
            show: {
              resource: [
                'file',
              ],
              fileOperation: [
                'uploadFile',
              ],
            },
          },
        },
        {
          displayName: 'File ID',
          name: 'fileId',
          type: 'string',
          default: '',
          description: 'ID of the File',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'file',
                'webhook' // for webhook delete
              ],
              fileOperation: [
                'getFile',
                'deleteFile',
                'processFile',
              ],
              agentFileOperation: [
                'deleteAgentFile'
              ],
              webhookOperation: [
                'deleteWebhook'
              ]
            },
          },
        },
        {
          displayName: 'File Instructions',
          name: 'fileInstructions',
          type: 'string',
          default: '',
          description: 'Instructions for file processing',
          displayOptions: {
            show: {
              resource: [
                'file',
              ],
              fileOperation: [
                'processFile',
              ],
            },
          },
        },
        // --- Webhook Operation Parameters ---
        {
          displayName: 'Webhook ID',
          name: 'webhookId',
          type: 'string',
          default: '',
          description: 'ID of the Webhook',
          required: true,
          displayOptions: {
            show: {
              resource: [
                'webhook',
              ],
              webhookOperation: [
                'deleteWebhook',
              ],
            },
          },
        },
        // --- API Endpoint (Common) ---
        {
          displayName: 'API Endpoint',
          name: 'apiEndpoint',
          type: 'string',
          default: 'https://api.tess.pareto.io/api/v1', // Base URL - from Tess AI doc
          description: 'Base URL for Tess AI API',
        },
      ],
    };
  }

  async execute(context) {
    const { resource } = context.payload.parameters;
    const apiEndpoint = context.payload.parameters.apiEndpoint;
    const credentials = await context.getCredentials('tessAiApi');
    const apiKey = credentials.apiKey;
    const headers = { Authorization: `Bearer ${apiKey}` };

    let operationResult = [];

    try {
      switch (resource) {
        case 'agent': {
          const agentOperation = context.payload.parameters.agentOperation;
          switch (agentOperation) {
            case 'listAgents': {
              const response = await axios.get(`${apiEndpoint}/agents`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'getAgent': {
              const agentId = context.payload.parameters.agentId;
              if (!agentId) throw new NodeOperationError(this.description.name, 'Agent ID is required.');
              const response = await axios.get(`${apiEndpoint}/agents/${agentId}`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'executeAgent': {
              const agentId = context.payload.parameters.agentId;
              const inputData = context.payload.parameters.inputData;
              if (!agentId) throw new NodeOperationError(this.description.name, 'Agent ID is required.');
              const response = await axios.post(`${apiEndpoint}/agents/${agentId}/execute`, inputData, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'executeAgentStream': {
              const agentId = context.payload.parameters.agentId;
              const inputData = context.payload.parameters.inputData;
              const streamOutput = context.payload.parameters.streamOutput; // Consider how to handle stream in n8n
              if (!agentId) throw new NodeOperationError(this.description.name, 'Agent ID is required.');
              // For now, just execute without streaming in n8n context, you might need to handle SSE or similar for real-time streaming
              const response = await axios.post(`${apiEndpoint}/agents/${agentId}/execute`, inputData, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'executeOpenaiCompatible': {
              const agentId = context.payload.parameters.agentId;
              const openaiMessages = context.payload.parameters.openaiMessages;
              if (!agentId) throw new NodeOperationError(this.description.name, 'Agent ID is required.');
              const response = await axios.post(`${apiEndpoint}/agents/${agentId}/openai`, { messages: openaiMessages }, { headers }); // Adjusted payload
              operationResult = [{ json: response.data }];
              break;
            }
            case 'getAgentResponse': {
              const agentId = context.payload.parameters.agentId;
              const responseId = context.payload.parameters.responseId;
              if (!agentId || !responseId) throw new NodeOperationError(this.description.name, 'Agent ID and Response ID are required.');
              const response = await axios.get(`${apiEndpoint}/agents/${agentId}/responses/${responseId}`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            default:
              throw new NodeOperationError(this.description.name, `Unknown Agent operation: ${agentOperation}`);
          }
          break;
        }
        case 'agentFile': {
          const agentFileOperation = context.payload.parameters.agentFileOperation;
          const agentId = context.payload.parameters.agentId; // Agent ID is needed for agent file operations
          if (!agentId) throw new NodeOperationError(this.description.name, 'Agent ID is required for Agent File operations.');

          switch (agentFileOperation) {
            case 'listAgentFiles': {
              const response = await axios.get(`${apiEndpoint}/agents/${agentId}/files`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'linkFilesToAgent': {
              const fileIds = context.payload.parameters.fileIds.split(',').map(id => id.trim()); // Split comma-separated IDs
              if (!fileIds || fileIds.length === 0) throw new NodeOperationError(this.description.name, 'File IDs are required to link files to agent.');
              const response = await axios.post(`${apiEndpoint}/agents/${agentId}/files/link`, { file_ids: fileIds }, { headers }); // Adjusted payload
              operationResult = [{ json: response.data }];
              break;
            }
            case 'deleteAgentFile': {
              const fileId = context.payload.parameters.fileId;
              if (!fileId) throw new NodeOperationError(this.description.name, 'File ID is required to delete agent file link.');
              const response = await axios.post(`${apiEndpoint}/agents/${agentId}/files/unlink`, { file_ids: [fileId] }, { headers }); // Adjusted to use unlink endpoint and file_ids array
              operationResult = [{ json: response.data }]; // API might expect file_ids as array
              break;
            }
            default:
              throw new NodeOperationError(this.description.name, `Unknown Agent File operation: ${agentFileOperation}`);
          }
          break;
        }
        case 'agentWebhook': {
          const agentWebhookOperation = context.payload.parameters.agentWebhookOperation;
          const agentId = context.payload.parameters.agentId;
          if (!agentId) throw new NodeOperationError(this.description.name, 'Agent ID is required for Agent Webhook operations.');

          switch (agentWebhookOperation) {
            case 'listAgentWebhooks': {
              const response = await axios.get(`${apiEndpoint}/agents/${agentId}/webhooks`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'createAgentWebhook': {
              const webhookUrl = context.payload.parameters.webhookUrl;
              const webhookEvents = context.payload.parameters.webhookEvents;
              if (!webhookUrl || !webhookEvents) throw new NodeOperationError(this.description.name, 'Webhook URL and Events are required to create agent webhook.');
              const response = await axios.post(`${apiEndpoint}/agents/${agentId}/webhooks`, { url: webhookUrl, events: webhookEvents }, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            default:
              throw new NodeOperationError(this.description.name, `Unknown Agent Webhook operation: ${agentWebhookOperation}`);
          }
          break;
        }
        case 'file': {
          const fileOperation = context.payload.parameters.fileOperation;
          switch (fileOperation) {
            case 'listFiles': {
              const response = await axios.get(`${apiEndpoint}/files`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'uploadFile': {
              const uploadFilename = context.payload.parameters.uploadFilename;
              const fileContent = context.payload.parameters.fileContent;
              const binaryData = context.payload.parameters.binaryData;

              if (!uploadFilename || !fileContent) throw new NodeOperationError(this.description.name, 'Filename and File Content are required for file upload.');

              let requestData;
              let requestHeaders = { ...headers }; // Start with default headers

              if (binaryData) {
                const formData = new FormData();
                const buffer = Buffer.from(fileContent, 'base64'); // Decode base64
                formData.append('file', buffer, uploadFilename); // Append buffer as file
                requestData = formData;
                requestHeaders = { ...headers, ...formData.getHeaders() }; // Update headers with form-data headers
              } else {
                requestData = { name: uploadFilename, content_b64: fileContent }; // Use base64 content as before
              }

              const response = await axios.post(`${apiEndpoint}/files`, requestData, { headers: requestHeaders });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'getFile': {
              const fileId = context.payload.parameters.fileId;
              if (!fileId) throw new NodeOperationError(this.description.name, 'File ID is required to get file.');
              const response = await axios.get(`${apiEndpoint}/files/${fileId}`, { headers, responseType: 'arraybuffer' }); // Important: arraybuffer for binary data
              operationResult = [{ json: { fileContent: Buffer.from(response.data).toString('base64') } }]; // Return content as base64
              break;
            }
            case 'deleteFile': {
              const fileId = context.payload.parameters.fileId;
              if (!fileId) throw new NodeOperationError(this.description.name, 'File ID is required to delete file.');
              const response = await axios.delete(`${apiEndpoint}/files/${fileId}`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'processFile': {
              const fileId = context.payload.parameters.fileId;
              const fileInstructions = context.payload.parameters.fileInstructions;
              if (!fileId) throw new NodeOperationError(this.description.name, 'File ID is required to process file.');
              const response = await axios.post(`${apiEndpoint}/files/${fileId}/process`, { instructions: fileInstructions }, { headers }); // Adjusted payload
              operationResult = [{ json: response.data }];
              break;
            }
            default:
              throw new NodeOperationError(this.description.name, `Unknown File operation: ${fileOperation}`);
          }
          break;
        }
        case 'webhook': {
          const webhookOperation = context.payload.parameters.webhookOperation;
          switch (webhookOperation) {
            case 'listWebhooks': {
              const response = await axios.get(`${apiEndpoint}/webhooks`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            case 'deleteWebhook': {
              const webhookId = context.payload.parameters.webhookId;
              if (!webhookId) throw new NodeOperationError(this.description.name, 'Webhook ID is required to delete webhook.');
              const response = await axios.delete(`${apiEndpoint}/webhooks/${webhookId}`, { headers });
              operationResult = [{ json: response.data }];
              break;
            }
            default:
              throw new NodeOperationError(this.description.name, `Unknown Webhook operation: ${webhookOperation}`);
          }
          break;
        }
        default:
          throw new NodeOperationError(this.description.name, `Unknown resource: ${resource}`);
      }

      return operationResult;

    } catch (error) {
      if (error.response) {
        throw new NodeOperationError(this.description.name, `Tess AI API error: ${error.response.status} - ${error.response.data} - ${error.response.data?.detail || error.message}`);
      } else if (error.request) {
        throw new NodeOperationError(this.description.name, 'No response from Tess AI API. Request timed out or API unavailable.');
      } else {
        throw new NodeOperationError(this.description.name, `Error setting up the request to Tess AI API: ${error.message}`);
      }
    }
  }
}

module.exports = TessAi;
