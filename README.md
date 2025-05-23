# Fetch MCP Server

This MCP server provides functionality to fetch web content in various formats, including HTML, JSON, plain text, and Markdown. It has been refactored to use the StreamableHttp Transport from the Model Context Protocol (MCP) SDK.

## Acknowledgements

This project is based on the original work by [Glama AI](https://glama.ai/), who created the initial Fetch MCP server. Special thanks to the original author for establishing the foundation of this useful tool.

## What's New

This implementation enhances the original Fetch MCP server by implementing remote access through the StreamableHttp Transport layer. The key changes include:

- Replaced the original stdio-based transport with StreamableHttp Transport
- Added RESTful API endpoints for HTTP-based MCP interactions
- Containerized the application for easier deployment and scaling
- Maintained full compatibility with all original tool functions

<a href="https://glama.ai/mcp/servers/nu09wf23ao">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/nu09wf23ao/badge" alt="Fetch Server MCP server" />
</a>

## Features

- Implements MCP server with StreamableHttp Transport
- Provides multiple content fetching tools
- Containerized for easy deployment
- RESTful API endpoints for MCP interactions
- Fetches web content using modern fetch API
- Supports custom headers for requests
- Uses JSDOM for HTML parsing and text extraction
- Uses TurndownService for HTML to Markdown conversion

## Supported Tools

- **fetch_html**
  - Fetch a website and return the content as HTML
  - Input:
    - `url` (string, required): URL of the website to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the raw HTML content of the webpage

- **fetch_json**
  - Fetch a JSON file from a URL
  - Input:
    - `url` (string, required): URL of the JSON to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the parsed JSON content

- **fetch_txt**
  - Fetch a website and return the content as plain text (no HTML)
  - Input:
    - `url` (string, required): URL of the website to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the plain text content of the webpage with HTML tags, scripts, and styles removed

- **fetch_markdown**
  - Fetch a website and return the content as Markdown
  - Input:
    - `url` (string, required): URL of the website to fetch
    - `headers` (object, optional): Custom headers to include in the request
  - Returns the content of the webpage converted to Markdown format

## Running with Docker

### Build the Docker image

```bash
docker build -t fetch-mcp .
```

### Run the Docker container

```bash
docker run -p 3000:3000 fetch-mcp
```

The server will be available at http://localhost:3000 with the MCP endpoint at http://localhost:3000/mcp.

## Environment Variables

- `PORT`: Port number for the server to listen on (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## API Endpoints

- `GET /`: Health check endpoint
- `POST /mcp`: Main MCP endpoint for tool invocation
- `GET /mcp`: Alternative MCP endpoint for GET requests

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run the server
pnpm start
```

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the server: `pnpm run build`
4. Start the server: `pnpm start`

## License

This project is licensed under the MIT License.