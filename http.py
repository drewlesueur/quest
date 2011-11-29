import SimpleHTTPServer,SocketServer
H = SimpleHTTPServer.SimpleHTTPRequestHandler
d = SocketServer.TCPServer(("", 8020), H)
d.serve_forever()
