/**
 * Copyright (C) 2017 TypeFox and others.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package fr.cea.nabla.web.internal.server.lsp;

import java.util.LinkedHashMap;

import javax.websocket.Endpoint;
import javax.websocket.EndpointConfig;
import javax.websocket.RemoteEndpoint;
import javax.websocket.Session;

import org.eclipse.lsp4j.jsonrpc.json.JsonRpcMethod;
import org.eclipse.lsp4j.jsonrpc.json.JsonRpcMethodProvider;
import org.eclipse.lsp4j.jsonrpc.json.MessageJsonHandler;
import org.eclipse.lsp4j.jsonrpc.services.ServiceEndpoints;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.LanguageClientAware;
import org.eclipse.lsp4j.services.LanguageServer;

import com.google.inject.Inject;

/**
 * Web socket endpoint for language servers including the diagram extension.
 */
@SuppressWarnings("all")
public class LanguageServerEndpoint extends Endpoint {
	@Inject
	private LanguageServer languageServer;

	@Override
	public void onOpen(final Session session, final EndpointConfig config) {
		final LinkedHashMap<String, JsonRpcMethod> supportedMethods = new LinkedHashMap<String, JsonRpcMethod>();
		supportedMethods.putAll(ServiceEndpoints.getSupportedMethods(LanguageClient.class));
		if ((this.languageServer instanceof JsonRpcMethodProvider)) {
			supportedMethods.putAll(((JsonRpcMethodProvider) this.languageServer).supportedMethods());
		}
		final MessageJsonHandler jsonHandler = new MessageJsonHandler(supportedMethods);
		RemoteEndpoint.Async _asyncRemote = session.getAsyncRemote();
		final CustomStreamMessageConsumer outgoingMessageStream = new CustomStreamMessageConsumer(_asyncRemote,
				jsonHandler);
		org.eclipse.lsp4j.jsonrpc.Endpoint _endpoint = ServiceEndpoints.toEndpoint(this.languageServer);
		final org.eclipse.lsp4j.jsonrpc.RemoteEndpoint serverEndpoint = new org.eclipse.lsp4j.jsonrpc.RemoteEndpoint(
				outgoingMessageStream, _endpoint);
		jsonHandler.setMethodProvider(serverEndpoint);
		final CustomStreamMessageProducer incomingMessageStream = new CustomStreamMessageProducer(null, jsonHandler);
		LanguageMessageHandler _languageMessageHandler = new LanguageMessageHandler(incomingMessageStream,
				serverEndpoint);
		session.addMessageHandler(_languageMessageHandler);
		final LanguageClient remoteProxy = ServiceEndpoints.<LanguageClient>toServiceObject(serverEndpoint,
				LanguageClient.class);
		if ((this.languageServer instanceof LanguageClientAware)) {
			((LanguageClientAware) this.languageServer).connect(remoteProxy);
		}
	}
}
