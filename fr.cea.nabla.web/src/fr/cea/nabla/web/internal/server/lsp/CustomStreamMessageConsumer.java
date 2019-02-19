/*******************************************************************************
 * Copyright (c) 2016 TypeFox GmbH (http://www.typefox.io) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package fr.cea.nabla.web.internal.server.lsp;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import javax.websocket.RemoteEndpoint;

import org.eclipse.lsp4j.jsonrpc.JsonRpcException;
import org.eclipse.lsp4j.jsonrpc.MessageConsumer;
import org.eclipse.lsp4j.jsonrpc.json.MessageConstants;
import org.eclipse.lsp4j.jsonrpc.json.MessageJsonHandler;
import org.eclipse.lsp4j.jsonrpc.messages.Message;

public class CustomStreamMessageConsumer implements MessageConsumer, MessageConstants {

	private final String encoding;
	private final MessageJsonHandler jsonHandler;

	private final Object outputLock = new Object();

	private OutputStream output;
	
	private RemoteEndpoint.Async remote;

	public CustomStreamMessageConsumer(RemoteEndpoint.Async remote, MessageJsonHandler jsonHandler) {
		this(remote, new ByteArrayOutputStream(), jsonHandler);
	}

	public CustomStreamMessageConsumer(RemoteEndpoint.Async remote, OutputStream output, MessageJsonHandler jsonHandler) {
		this(output, StandardCharsets.UTF_8.name(), jsonHandler);
		this.remote = remote;
	}

	public CustomStreamMessageConsumer(OutputStream output, String encoding, MessageJsonHandler jsonHandler) {
		this.output = output;
		this.encoding = encoding;
		this.jsonHandler = jsonHandler;
	}

	public OutputStream getOutput() {
		return output;
	}

	public void setOutput(OutputStream output) {
		this.output = output;
	}

	@Override
	public void consume(Message message) {
		try {
			String content = jsonHandler.serialize(message);
			byte[] contentBytes = content.getBytes(encoding);
			synchronized (outputLock) {
				output.write(contentBytes);
				output.flush();
			}
			remote.sendText(output.toString());
			if(output instanceof ByteArrayOutputStream) {				
				((ByteArrayOutputStream)output).reset();
			}
		} catch (IOException exception) {
			throw new JsonRpcException(exception);
		}
	}

	/**
	 * Construct a header to be prepended to the actual content. This implementation writes
	 * {@code Content-Length} and {@code Content-Type} attributes according to the LSP specification.
	 */
	protected String getHeader(int contentLength) {
		StringBuilder headerBuilder = new StringBuilder();
		appendHeader(headerBuilder, CONTENT_LENGTH_HEADER, contentLength).append(CRLF);
		if (!StandardCharsets.UTF_8.name().equals(encoding)) {
			appendHeader(headerBuilder, CONTENT_TYPE_HEADER, JSON_MIME_TYPE);
			headerBuilder.append("; charset=").append(encoding).append(CRLF);
		}
		headerBuilder.append(CRLF);
		return headerBuilder.toString();
	}

	/**
	 * Append a header attribute to the given builder.
	 */
	protected StringBuilder appendHeader(StringBuilder builder, String name, Object value) {
		return builder.append(name).append(": ").append(value);
	}

}
