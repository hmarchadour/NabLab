package fr.cea.nabla.web.internal.server.lsp;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

import javax.servlet.ServletException;
import javax.websocket.DeploymentException;
import javax.websocket.server.ServerContainer;
import javax.websocket.server.ServerEndpointConfig;
import javax.websocket.server.ServerEndpointConfig.Builder;

import org.eclipse.core.runtime.FileLocator;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.websocket.jsr356.server.deploy.WebSocketServerContainerInitializer;
import org.eclipse.sirius.server.api.ISiriusServerConfigurator;
import org.osgi.framework.Bundle;

import com.google.inject.Injector;

import fr.cea.nabla.ide.NablaIdeSetup;
import fr.cea.nabla.nabla.NablaPackage;
import fr.cea.nabla.web.NablaWebPlugin;

public class NabLaLSPServerConfigurator implements ISiriusServerConfigurator {

	/**
	 * The default context path.
	 */
	private static final String CONTEXT_PATH = "/nabla"; //$NON-NLS-1$

	@Override
	public void configure(Server server) {
		try {
			ServletContextHandler servletContextHandler = new ServletContextHandler(
					ServletContextHandler.SESSIONS | ServletContextHandler.GZIP);
			servletContextHandler.setContextPath(CONTEXT_PATH);

			Handler handler = server.getHandler();
			if (handler instanceof HandlerCollection) {
				HandlerCollection handlerCollection = (HandlerCollection) handler;
				handlerCollection.addHandler(servletContextHandler);
			}

			ServletHolder servletHolder = new ServletHolder("NabLab LSP", new DefaultServlet());

			Bundle bundle = NablaWebPlugin.getPlugin().getBundle();
			URL webappFolderUrl = bundle.getResource("./webapp"); //$NON-NLS-1$
			URI webappFolderUri = FileLocator.resolve(webappFolderUrl).toURI();
			String webappFolderAbsolutePath = new File(webappFolderUri).getAbsolutePath();

			servletHolder.setInitParameter("resourceBase", webappFolderAbsolutePath); //$NON-NLS-1$
			servletHolder.setInitParameter("dirAllowed", "false"); //$NON-NLS-1$ //$NON-NLS-2$
			servletContextHandler.addServlet(servletHolder, "/"); //$NON-NLS-1$

			// Initialize the Nabla Xtext language
			NablaPackage.eINSTANCE.getNsURI();
			Injector injector = new NablaIdeSetup().createInjectorAndDoEMFRegistration();
			ServerEndpointConfigurator serverEndpointConfigurator = new ServerEndpointConfigurator(injector);
			Builder endpointConfigBuilder = Builder.create(LanguageServerEndpoint.class, "/lsp");
			ServerEndpointConfig endpointConfig = endpointConfigBuilder.configurator(serverEndpointConfigurator)
					.build();

			ServerContainer container = WebSocketServerContainerInitializer.configureContext(servletContextHandler);
			container.setDefaultMaxSessionIdleTimeout(0);
			container.addEndpoint(endpointConfig);
		} catch (ServletException | URISyntaxException | IOException | DeploymentException exception) {
			exception.printStackTrace();
		}
	}
}
