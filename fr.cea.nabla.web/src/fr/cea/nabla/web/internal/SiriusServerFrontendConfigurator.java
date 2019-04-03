/*******************************************************************************
 * Copyright (c) 2018 Obeo.
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License 2.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *    Obeo - initial API and implementation
 *******************************************************************************/
package fr.cea.nabla.web.internal;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.EnumSet;

import javax.servlet.DispatcherType;

import org.eclipse.core.runtime.FileLocator;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;
import org.eclipse.core.runtime.URIUtil;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.sirius.server.api.ISiriusServerConfigurator;
import org.osgi.framework.Bundle;

import fr.cea.nabla.web.NablaWebPlugin;

/**
 * The entry point of the front-end used to configure the Sirius server.
 *
 * @author sbegaudeau
 */
public class SiriusServerFrontendConfigurator implements ISiriusServerConfigurator {

	/**
	 * The context path of the Sirius front-end.
	 */
	private static final String CONTEXT_PATH = "/"; //$NON-NLS-1$

	/**
	 * The default servlet holder name.
	 */
	private static final String SERVLET_HOLDER_NAME = "SiriusFrontendServletHolder"; //$NON-NLS-1$

	/**
	 * The path of the front end resources.
	 */
	private static final String FRONTEND_RESOURCES_PATH = "./webapp"; //$NON-NLS-1$

	/**
	 * The path of the default servlet used to expose the static resources.
	 */
	private static final String SERVLET_PATH = "/"; //$NON-NLS-1$

	/**
	 * {@inheritDoc}
	 *
	 * @see org.eclipse.sirius.server.api.ISiriusServerConfigurator#configure(org.eclipse.jetty.server.Server)
	 */
	@Override
	public void configure(Server server) {
		ServletContextHandler servletContextHandler = new ServletContextHandler(
				ServletContextHandler.SESSIONS | ServletContextHandler.GZIP);
		servletContextHandler.setContextPath(CONTEXT_PATH);

		servletContextHandler.addFilter(SiriusServerFrontendFilter.class, "/*", //$NON-NLS-1$
				EnumSet.of(DispatcherType.REQUEST, DispatcherType.INCLUDE));

		try {
			Bundle bundle = NablaWebPlugin.getPlugin().getBundle();
			URL frontendResourcesURL = bundle.getResource(FRONTEND_RESOURCES_PATH);
			URL resolvedURL = FileLocator.resolve(frontendResourcesURL);
			URI frontendResourcesURI = URIUtil.toURI(resolvedURL);
			String frontendResourcesPath = new File(frontendResourcesURI).getAbsolutePath();

			ServletHolder servletHolder = new ServletHolder(SERVLET_HOLDER_NAME, new DefaultServlet());
			servletHolder.setInitParameter("resourceBase", frontendResourcesPath); //$NON-NLS-1$
			servletHolder.setInitParameter("dirAllowed", "false"); //$NON-NLS-1$ //$NON-NLS-2$
			servletContextHandler.addServlet(servletHolder, SERVLET_PATH);

			Handler handler = server.getHandler();
			if (handler instanceof HandlerCollection) {
				HandlerCollection handlerCollection = (HandlerCollection) handler;
				handlerCollection.addHandler(servletContextHandler);
			}
		} catch (URISyntaxException | IOException exception) {
			IStatus status = new Status(IStatus.ERROR, NablaWebPlugin.PLUGIN_ID, exception.getMessage(), exception);
			NablaWebPlugin.getPlugin().log(status);
		}
	}
}
