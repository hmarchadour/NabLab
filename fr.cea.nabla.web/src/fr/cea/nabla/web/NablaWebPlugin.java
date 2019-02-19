package fr.cea.nabla.web;

import org.eclipse.emf.common.EMFPlugin;
import org.eclipse.emf.common.util.ResourceLocator;
import org.osgi.framework.BundleContext;

public class NablaWebPlugin extends EMFPlugin {
	/**
	 * The identifier of the plugin.
	 */
	public static final String PLUGIN_ID = "fr.cea.nabla.web"; //$NON-NLS-1$

	/**
	 * The sole instance of the plugin.
	 */
	public static final NablaWebPlugin INSTANCE = new NablaWebPlugin();

	/**
	 * The sole instance of the bundle activator.
	 */
	private static Implementation plugin;

	/**
	 * The constructor.
	 */
	public NablaWebPlugin() {
		super(new ResourceLocator[0]);
	}

	@Override
	public ResourceLocator getPluginResourceLocator() {
		return plugin;
	}

	/**
	 * Returns the singleton instance of the Eclipse plugin.
	 *
	 * @return the singleton instance.
	 */
	public static Implementation getPlugin() {
		return plugin;
	}

	/**
	 * The bundle activator.
	 *
	 * @author sbegaudeau
	 */
	public static class Implementation extends EclipsePlugin {

		/**
		 * The constructor.
		 */
		public Implementation() {
			super();
			NablaWebPlugin.plugin = this;
		}

		/**
		 * {@inheritDoc}
		 *
		 * @see org.eclipse.core.runtime.Plugin#start(org.osgi.framework.BundleContext)
		 */
		@Override
		public void start(BundleContext context) throws Exception {
			super.start(context);
		}

		/**
		 * {@inheritDoc}
		 *
		 * @see org.eclipse.core.runtime.Plugin#stop(org.osgi.framework.BundleContext)
		 */
		@Override
		public void stop(BundleContext context) throws Exception {
			super.stop(context);
		}
	}

}
