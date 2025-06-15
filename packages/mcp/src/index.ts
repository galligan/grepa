// ::: tldr MCP server stub for future waymark MCP server implementation
// ::: todo implement MCP server functionality

export interface McpServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  port?: number;
}

export function createMcpServer(): McpServer {
  // ::: todo implement actual MCP server
  throw new Error('MCP server not yet implemented');
}