import express, { Request, Response } from 'express';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Fetcher } from './Fetcher.js';
import { RequestPayloadSchema, RequestPayload } from './types.js';


const getServer = () => {
  // Create an MCP server with implementation details
  const server = new McpServer({
    name: 'fetch-streamable-http-server',
    version: '1.0.0',
  }, {
    capabilities: {}
  });
  server.tool(
    "fetch_html",
    "Fetch HTML from a URL",
    RequestPayloadSchema.shape, 
    async (params: RequestPayload, extra) => {
      console.log('Executing fetch_html tool call with params:', params);
      const result = await Fetcher.html(params);
      return result;
    }
  );

  server.tool(
    "fetch_json",
    "Fetch JSON from a URL",
    RequestPayloadSchema.shape,
    async (params: RequestPayload, extra) => {
      console.log('Executing fetch_json tool call with params:', params);
      return await Fetcher.json(params);
    }
  );
  server.tool(
    "fetch_markdown",
    "Fetch Markdown from a URL",
    RequestPayloadSchema.shape,
    async (params: RequestPayload, extra) => {
      console.log('Executing fetch_markdown tool call with params:', params);
      return await Fetcher.markdown(params);
    }
  );
  server.tool(
    "fetch_txt",
    "Fetch plain text from a URL",
    RequestPayloadSchema.shape,
    async (params: RequestPayload, extra) => {
      console.log('Executing fetch_txt tool call with params:', params);
      return await Fetcher.txt(params);
    }
  );
  return server;
}

const app = express();
app.use(express.json());
const server = getServer();

const requestHandler = async (req: Request, res: Response) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    
    // Keep the connection open until the response is complete
    res.on('finish', () => {
      transport.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
};

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Okay'
  });
});

app.post('/mcp', requestHandler);

app.get('/mcp', requestHandler);

app.delete('/mcp', async (req: Request, res: Response) => {
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});


// Start the server
const PORT = parseInt(process.env.PORT || "3000");
const httpServer = app.listen(PORT, () => {
  console.log(`MCP fetch Streamable HTTP Server is running on port ${PORT}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Graceful shutdown...');
  server.close();
  httpServer.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Graceful shutdown...');
  server.close();
  httpServer.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

