package fr.cea.nabla.ide

import com.google.inject.AbstractModule
import java.util.concurrent.ExecutorService
import org.eclipse.lsp4j.services.LanguageServer
import org.eclipse.xtext.ide.ExecutorServiceProvider
import org.eclipse.xtext.resource.IContainer
import org.eclipse.xtext.resource.IResourceServiceProvider
import org.eclipse.xtext.resource.ResourceServiceProviderServiceLoader
import org.eclipse.xtext.resource.containers.ProjectDescriptionBasedContainerManager
import org.eclipse.xtext.ide.server.IWorkspaceConfigFactory
import org.eclipse.xtext.ide.server.IProjectDescriptionFactory
import org.eclipse.xtext.ide.server.DefaultProjectDescriptionFactory
import org.eclipse.xtext.ide.server.ProjectWorkspaceConfigFactory
import org.eclipse.xtext.ide.server.LanguageServerImpl

/**
 * @author Sven Efftinge - Initial contribution and API
 * @since 2.11
 */
class CustomServerModule extends AbstractModule {
    
    override protected configure() {
		binder.bind(ExecutorService).toProvider(ExecutorServiceProvider)
		
    	bind(LanguageServer).to(CustomLanguageServerImpl)
        bind(IResourceServiceProvider.Registry).toProvider(ResourceServiceProviderServiceLoader)
        bind(IWorkspaceConfigFactory).to(ProjectWorkspaceConfigFactory)
        bind(IProjectDescriptionFactory).to(DefaultProjectDescriptionFactory)
        bind(IContainer.Manager).to(ProjectDescriptionBasedContainerManager)
    }
    
}