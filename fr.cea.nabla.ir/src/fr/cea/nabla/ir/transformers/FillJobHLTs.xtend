package fr.cea.nabla.ir.transformers

import fr.cea.nabla.ir.ir.IrFactory
import fr.cea.nabla.ir.ir.IrModule
import fr.cea.nabla.ir.ir.Job
import fr.cea.nabla.ir.ir.TimeIterationCopyJob
import java.util.HashMap
import org.jgrapht.alg.CycleDetector
import org.jgrapht.alg.FloydWarshallShortestPaths
import org.jgrapht.graph.DefaultWeightedEdge
import org.jgrapht.graph.DirectedWeightedPseudograph

import static extension fr.cea.nabla.ir.JobExtensions.*

class FillJobHLTs implements IrTransformationStep
{
	static val TimeLoopSourceNodeLabel = 'TimeLoopSourceNode'
	static val GlobalSourceNodeLabel = 'GlobalSourceNode'

	
	override getDescription() 
	{
		'Compute hierarchical logical time of each jobs'
	}
	
	/**
	 * Prend en param�tre une instance de IrModule et renseigne l'attribut @ des jobs
	 * en utilisant des fonctionnalit�s de la biblioth�que de graphe jgrapht.
	 * Retourne faux si le graphe a des cycles et que le calcul des @ est impossible, vrai sinon.
	 * Si le graphe a des cycles, les noeuds impliqu�s ont leur attribut onCycle � vrai.
	 */
	override transform(IrModule m)
	{
		// creation du graphe
		val globalSourceNode = IrFactory::eINSTANCE.createInstructionJob => [ name = GlobalSourceNodeLabel ]
		val timeLoopSourceNode = IrFactory::eINSTANCE.createInstructionJob => [ name = TimeLoopSourceNodeLabel ]
		val g = m.createGraph(globalSourceNode, timeLoopSourceNode)
		
		// calcul des @
		val cycles = g.findCycle
		if (cycles === null)
		{
			val jalgo = new FloydWarshallShortestPaths<Job, DefaultWeightedEdge>(g)	
			
			// Calcul des at des noeuds de boucle en temps � partir de timeLoopSourceNode
			// Les at correspondent au plus long chemin. L'algo recherche le plus court. Il faut travailler avec l'inverse.
			// On initialise donc les arcs � -1
			g.edgeSet.forEach[e | g.setEdgeWeight(e, -1)]
			for (v : g.vertexSet.filter[v | v!=timeLoopSourceNode])
			{
				val graphPath = jalgo.getShortestPath(timeLoopSourceNode, v)
				if (graphPath!==null) graphPath.endVertex.at = Math::abs(graphPath.weight)
			}
			
			// Calcul des at des noeuds d'init qui sont les noeuds restants (ceux avec at inchang� ; � 0).
			val weightByJobs = new HashMap<Job, Double>
			for (v : g.vertexSet.filter[v | v!=globalSourceNode && (v.at as int)==0])
			{
				val graphPath = jalgo.getShortestPath(globalSourceNode, v)
				if (graphPath!==null) weightByJobs.put(graphPath.endVertex, graphPath.weight)
			}
			val minWeight = weightByJobs.values.min
			for (j : weightByJobs.keySet) j.at = minWeight - weightByJobs.get(j) - 1
		}
	}
	
	/** 
	 * Cr�ation d'un graphe comrrespondant � l'IR. 
	 * 2 noeuds sources sont ajout�s : 1 correspondant � un noeud source global 
	 * et l'autre � l'entr�e de la boucle en temps. Notons que les arcs sortants
	 * des jobs de type TimeIterationCopyJob ne sont pas construits pour �viter les cycles.
	 */
	private def createGraph(IrModule it, Job globalSourceNode, Job timeLoopSourceNode)
	{	
		val g = new DirectedWeightedPseudograph<Job, DefaultWeightedEdge>(DefaultWeightedEdge)
		jobs.forEach[x|g.addVertex(x)]
		g.addVertex(timeLoopSourceNode)
		for (from : jobs)
			for (to : from.nextJobs)
				if (from instanceof TimeIterationCopyJob)
					g.addEdge(timeLoopSourceNode, to)
				else
					g.addEdge(from, to)	
		
		// ajout du noeud source global
		g.addVertex(globalSourceNode)
		g.vertexSet.filter[v | v!==globalSourceNode && v!==timeLoopSourceNode && g.incomingEdgesOf(v).empty].forEach[x | g.addEdge(globalSourceNode, x)]

		// affichage du graphe
		// g.print
		
		return g				
	}
	
//	private def print(DirectedWeightedPseudograph<Job, DefaultWeightedEdge> g)
//	{
//		println('Graph nodes : ')
//		g.vertexSet.forEach[x|println('  ' + x.name)]
//		println('Graph arcs : ')
//		g.edgeSet.forEach[x|println('  ' + g.getEdgeSource(x).name + ' -> ' + g.getEdgeTarget(x).name)]
//	}
	
	/** Retourne la liste des noeuds du graphe impliqu�s dans au moins un cycle, null si pas de cycle */
	private def findCycle(DirectedWeightedPseudograph<Job, DefaultWeightedEdge> g)
	{
		val cycleDetector = new CycleDetector<Job, DefaultWeightedEdge>(g)
		if (cycleDetector.detectCycles) 
		{
			val nodesOnCycle = cycleDetector.findCycles
			nodesOnCycle.forEach[onCycle = true]
			return nodesOnCycle
		}
		else return null
	}
}