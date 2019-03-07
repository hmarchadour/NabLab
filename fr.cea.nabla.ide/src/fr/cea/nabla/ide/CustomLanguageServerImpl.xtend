/*******************************************************************************
 * Copyright (c) 2016, 2017 TypeFox GmbH (http://www.typefox.io) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package fr.cea.nabla.ide

import com.google.inject.Inject
import fr.cea.nabla.LatexLabelServices
import fr.cea.nabla.nabla.Instruction
import fr.cea.nabla.nabla.Job
import java.util.List
import org.eclipse.emf.ecore.EObject
import org.eclipse.lsp4j.DocumentHighlight
import org.eclipse.lsp4j.DocumentHighlightKind
import org.eclipse.lsp4j.Range
import org.eclipse.lsp4j.TextDocumentPositionParams
import org.eclipse.xtend.lib.annotations.Accessors
import org.eclipse.xtext.ide.server.LanguageServerImpl
import org.eclipse.xtext.ide.server.UriExtensions
import org.eclipse.xtext.ide.server.WorkspaceManager
import org.eclipse.xtext.ide.server.occurrences.IDocumentHighlightService
import org.eclipse.xtext.resource.EObjectAtOffsetHelper
import org.eclipse.xtext.resource.IResourceServiceProvider

class CustomLanguageServerImpl extends LanguageServerImpl {
	
	@Inject extension UriExtensions
	
	@Inject extension IResourceServiceProvider.Registry languagesRegistry

	@Accessors(PUBLIC_GETTER) WorkspaceManager manager;

	@Inject
	EObjectAtOffsetHelper eObjectAtOffsetHelper;

	@Inject
	override setWorkspaceManager(WorkspaceManager manager) {
		super.setWorkspaceManager(manager)
		this.manager = manager;
	}
	
	override documentHighlight(TextDocumentPositionParams params) {
		return requestManager.runRead [ cancelIndicator |
			val uri = params.textDocument.uri.toUri;
			val serviceProvider = uri.resourceServiceProvider;
			val service = serviceProvider?.get(IDocumentHighlightService);
			if (service === null)
				return emptyList
			
			return manager.doRead(uri) [doc, resource |
				val offSet = doc.getOffSet(params.getPosition());
				val containedElementAt = eObjectAtOffsetHelper.resolveContainedElementAt(resource,
						offSet);
					val res = service.getDocumentHighlights(doc, resource, params, cancelIndicator);
				if(!res.isEmpty) {					
				val nablaElt = getJobOrInstruction(containedElementAt);
				if (nablaElt !== null) {
					val latex = LatexLabelServices.getLatex(nablaElt)			
					val  List<DocumentHighlight> myList = newArrayList()
					res.forEach[
						element, index |
						if(index== 0) {
							val replacedElement = new CustomDocumentHighlight(element.range, element.kind, latex);
							myList.add(replacedElement);
						} else {
							myList.add(element);
						}
					]
					return myList
				}
				}
				return res;
			]
		];
	}
	
	private def EObject getJobOrInstruction(EObject elt)
	{
		switch elt
		{
			Job : elt
			Instruction : elt
			default : if (elt.eContainer === null) null else elt.eContainer.jobOrInstruction
		}
	}
	
	
}

	
	/**
 * A document highlight is a range inside a text document which deserves special attention. Usually a document highlight
 * is visualized by changing the background color of its range.
 */
class CustomDocumentHighlight extends DocumentHighlight {
	
	public String formula
	
	
	new(Range range, DocumentHighlightKind kind, String formula) {
    	super(range, kind)
    	this.formula=formula
    }
}