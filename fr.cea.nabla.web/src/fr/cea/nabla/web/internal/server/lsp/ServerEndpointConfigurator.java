package fr.cea.nabla.web.internal.server.lsp;

import java.util.List;

import javax.websocket.Extension;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;
import javax.websocket.server.ServerEndpointConfig.Configurator;

import org.eclipse.jetty.websocket.jsr356.server.ContainerDefaultConfigurator;

import com.google.inject.Injector;

public class ServerEndpointConfigurator extends Configurator {

	Injector injector;

	public ServerEndpointConfigurator(Injector injector) {
		this.injector = injector;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see javax.websocket.server.ServerEndpointConfig.Configurator#getEndpointInstance(java.lang.Class)
	 */
	@Override
	public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
		try {
			T instance = (T) injector.getInstance(LanguageServerEndpoint.class);
			return instance;
		} catch (SecurityException | IllegalArgumentException e) {
			throw new InstantiationException(String.format("%s: %s", e.getClass().getName(), e.getMessage())); //$NON-NLS-1$
		}
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see javax.websocket.server.ServerEndpointConfig.Configurator#checkOrigin(java.lang.String)
	 */
	@Override
	public boolean checkOrigin(String originHeaderValue) {
		return new ContainerDefaultConfigurator().checkOrigin(originHeaderValue);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see javax.websocket.server.ServerEndpointConfig.Configurator#modifyHandshake(javax.websocket.server.ServerEndpointConfig,
	 *      javax.websocket.server.HandshakeRequest,
	 *      javax.websocket.HandshakeResponse)
	 */
	@Override
	public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
		new ContainerDefaultConfigurator().modifyHandshake(sec, request, response);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see javax.websocket.server.ServerEndpointConfig.Configurator#getNegotiatedSubprotocol(java.util.List,
	 *      java.util.List)
	 */
	@Override
	public String getNegotiatedSubprotocol(List<String> supported, List<String> requested) {
		return new ContainerDefaultConfigurator().getNegotiatedSubprotocol(supported, requested);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see javax.websocket.server.ServerEndpointConfig.Configurator#getNegotiatedExtensions(java.util.List,
	 *      java.util.List)
	 */
	@Override
	public List<Extension> getNegotiatedExtensions(List<Extension> installed, List<Extension> requested) {
		return new ContainerDefaultConfigurator().getNegotiatedExtensions(installed, requested);
	}

}
