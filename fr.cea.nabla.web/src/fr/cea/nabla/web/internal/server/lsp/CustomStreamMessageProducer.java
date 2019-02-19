package fr.cea.nabla.web.internal.server.lsp;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.eclipse.lsp4j.jsonrpc.MessageConsumer;
import org.eclipse.lsp4j.jsonrpc.json.MessageJsonHandler;
import org.eclipse.lsp4j.jsonrpc.json.StreamMessageProducer;
import org.eclipse.lsp4j.jsonrpc.messages.Message;

public class CustomStreamMessageProducer extends StreamMessageProducer {

	private final MessageJsonHandler jsonHandler;
	
	public CustomStreamMessageProducer(InputStream input, MessageJsonHandler jsonHandler) {
		super(input, jsonHandler);
		this.jsonHandler = jsonHandler;
	}

	
	@Override
	public void listen(MessageConsumer callback) {
		InputStream input = getInput();
		InputStreamReader streamReader = new InputStreamReader(input);
		try {			
			Message message = jsonHandler.parseMessage(streamReader);
			callback.consume(message);
		} finally {
			try {
				streamReader.close();
			} catch (IOException e) {
				System.err.println(e.getMessage());
			}
		}
	}
}
