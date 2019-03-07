/*******************************************************************************
 * Copyright (c) 2018 CEA
 * This program and the accompanying materials are made available under the 
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 * 	Benoit Lelandais - initial implementation
 * 	Marie-Pierre Oudot - initial implementation
 * 	Jean-Sylvain Camier - Nabla generation support
 *******************************************************************************/
package fr.cea.nabla.ide

import com.google.inject.Guice
import fr.cea.nabla.NablaRuntimeModule
import fr.cea.nabla.NablaStandaloneSetup
import org.eclipse.xtext.resource.IResourceServiceProvider
import org.eclipse.xtext.util.Modules2

/**
 * Initialization support for running Xtext languages as language servers.
 */
class NablaLSPModule extends NablaStandaloneSetup {

	override createInjector() {
		Guice.createInjector(Modules2.mixin(new NablaRuntimeModule, new NablaIdeModule, new CustomServerModule,
			[bind(IResourceServiceProvider.Registry).toProvider(IResourceServiceProvider.Registry.RegistryProvider)]
		))
	}
}
