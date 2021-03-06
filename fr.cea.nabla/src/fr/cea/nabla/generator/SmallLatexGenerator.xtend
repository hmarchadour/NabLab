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
package fr.cea.nabla.generator

import fr.cea.nabla.nabla.NablaModule

import static extension fr.cea.nabla.LatexLabelServices.*

class SmallLatexGenerator 
{
	def getLatexContent(NablaModule m) 
	'''
		\documentclass[11pt]{article}
		
		\use package{fontspec}
		\use package{geometry}
		\geometry{landscape}
		
		\title{Nabla Module «m.name»}
		\author{Generated by the NabLab environment}
		
		\begin{document}
		\maketitle

		«FOR j : m.jobs»
		«val latexContent = j.latex»
		«IF !latexContent.nullOrEmpty»
		
		\section{«j.name»}
		$«latexContent»$

		«ENDIF»
		«ENDFOR»
		\end{document}	'''
}