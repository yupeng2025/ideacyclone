import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { MindNode, MindLink } from '../types';

export interface MindMapRef {
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
  focusNode: (nodeId: string) => void;
  exportToImage: () => Promise<string>;
}

interface MindMapProps {
  nodes: MindNode[];
  links: MindLink[];
  onNodeClick: (nodeId: string) => void;
  onNodeRightClick: (nodeId: string) => void;
  width: number;
  height: number;
  isDarkMode: boolean;
}

export const MindMap = forwardRef<MindMapRef, MindMapProps>(({
  nodes,
  links,
  onNodeClick,
  onNodeRightClick,
  width,
  height,
  isDarkMode
}, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<MindNode, MindLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const currentScaleRef = useRef<number>(1);
  
  // Theme constants
  const theme = {
    bg: isDarkMode ? '#111827' : '#f9fafb', // gray-900 : gray-50
    nodeFill: isDarkMode ? '#1F2937' : '#ffffff',
    nodeFillSelected: isDarkMode ? '#4B5563' : '#F0FDFA', // Cyan-50 tint in light mode
    textPrimary: isDarkMode ? '#F9FAFB' : '#111827',
    textSecondary: isDarkMode ? '#9CA3AF' : '#6B7280',
    linkStroke: isDarkMode ? '#374151' : '#E2E8F0',
    strokeRoot: isDarkMode ? '#F3F4F6' : '#000000',
    strokeChild: isDarkMode ? '#4B5563' : '#e5e7eb',
    selectionStroke: '#06b6d4', // Cyan-500
  };

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.2);
      }
    },
    zoomOut: () => {
      if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.8);
      }
    },
    centerView: () => {
       if (svgRef.current && zoomRef.current) {
        d3.select(svgRef.current).transition().duration(750).call(
            zoomRef.current.transform, 
            d3.zoomIdentity.translate(width/2, height/2).scale(1).translate(-width/2, -height/2) 
        );
      }
    },
    focusNode: (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node && node.x !== undefined && node.y !== undefined && svgRef.current && zoomRef.current) {
        const transform = d3.zoomIdentity.translate(width / 2, height / 2).scale(1.5).translate(-node.x, -node.y);
        d3.select(svgRef.current).transition().duration(1000).ease(d3.easeCubicOut).call(zoomRef.current.transform, transform);
      }
    },
    exportToImage: async () => {
        if (!svgRef.current) throw new Error("Canvas not ready");
        
        // Temporarily explicitly set styles for export
        const svgElement = svgRef.current;
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);
        
        // Basic cleanup
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');

        const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
        return new Promise((resolve, reject) => {
             const img = new Image();
             img.onload = () => {
                 const canvas = document.createElement('canvas');
                 canvas.width = width;
                 canvas.height = height;
                 const ctx = canvas.getContext('2d');
                 if (!ctx) { reject("Canvas context error"); return; }
                 ctx.fillStyle = theme.bg;
                 ctx.fillRect(0, 0, width, height);
                 ctx.drawImage(img, 0, 0);
                 resolve(canvas.toDataURL("image/png"));
             };
             img.onerror = (e) => reject(e);
             img.src = url;
        });
    }
  }));

  useEffect(() => {
    if (!svgRef.current) return;
    const simulation = d3.forceSimulation<MindNode, MindLink>()
      .force("link", d3.forceLink<MindNode, MindLink>().id(d => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("collide", d3.forceCollide().radius((d) => (d.selected || d.type === 'root' ? 90 : 70)).iterations(2))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05));
    simulationRef.current = simulation;
    return () => { simulation.stop(); };
  }, []);

  useEffect(() => {
    if (simulationRef.current) {
        simulationRef.current.force("center", d3.forceCenter(width / 2, height / 2).strength(0.05));
        simulationRef.current.alpha(0.3).restart();
    }
  }, [width, height]);

  // Main Rendering Loop
  useEffect(() => {
    if (!svgRef.current || !simulationRef.current) return;

    const svg = d3.select(svgRef.current);
    const simulation = simulationRef.current;

    // --- Defs ---
    let defs = svg.select<SVGDefsElement>("defs");
    if (defs.empty()) defs = svg.append("defs");
    
    // Add arrow marker
    if (defs.select("#arrowhead").empty()) {
        defs.append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 25) // pushed back to not overlap circle
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", theme.linkStroke);
    } else {
        defs.select("#arrowhead path").attr("fill", theme.linkStroke);
    }

    // --- Groups ---
    let g = svg.select<SVGGElement>(".main-group");
    if (g.empty()) {
      g = svg.append("g").attr("class", "main-group");
      g.append("g").attr("class", "links-group");
      g.append("g").attr("class", "nodes-group");

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
          currentScaleRef.current = event.transform.k;
          
          // Semantic Zoom: Hide details when zoomed out
          const isZoomedOut = event.transform.k < 0.6;
          svg.selectAll(".node-details").transition().duration(200).style("opacity", isZoomedOut ? 0 : 1);
        });
      
      zoomRef.current = zoom;
      svg.call(zoom)
         .on("dblclick.zoom", null); // Disable double click zoom
      
      // UX: Double click bg to reset view
      svg.on("dblclick", (e) => {
         if (e.target === svgRef.current) {
             svg.transition().duration(750).call(
                 zoom.transform,
                 d3.zoomIdentity.translate(width/2, height/2).scale(1).translate(-width/2, -height/2)
             );
         }
      });
    }

    // --- Data Prep ---
    const d3Links = links.map(l => ({
      ...l,
      source: typeof l.source === 'object' ? (l.source as MindNode).id : l.source,
      target: typeof l.target === 'object' ? (l.target as MindNode).id : l.target
    }));

    simulation.nodes(nodes);
    simulation.force<d3.ForceLink<MindNode, MindLink>>("link")?.links(d3Links);

    // --- Links (Bezier Curves) ---
    const linkGroup = g.select(".links-group");
    const linkSelection = linkGroup.selectAll<SVGPathElement, MindLink>(".link")
      .data(d3Links, (d) => `${(d.source as any).id || d.source}-${(d.target as any).id || d.target}`);

    linkSelection.exit().remove();
    const linkEnter = linkSelection.enter().append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke-width", 2);
    
    const linkMerge = linkEnter.merge(linkSelection);
    linkMerge.transition().duration(300).attr("stroke", theme.linkStroke);

    // --- Nodes ---
    const nodeGroup = g.select(".nodes-group");
    const nodeSelection = nodeGroup.selectAll<SVGGElement, MindNode>(".node")
      .data(nodes, (d) => d.id);

    nodeSelection.exit().transition().duration(300).attr("opacity", 0).remove();

    const nodeEnter = nodeSelection.enter().append("g")
      .attr("class", "node")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, MindNode>()
        .on("start", (e, d) => {
            if (!e.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => {
            if (!e.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
        })
      );
      // Event listeners are now attached to nodeMerge to handle closure updates

    // Node Circle
    nodeEnter.append("circle").attr("class", "node-bg");
    
    // Enhanced Pulse Animation Elements
    const pulseGroup = nodeEnter.append("g").attr("class", "pulse-group");
    pulseGroup.append("circle")
        .attr("class", "pulse-ring")
        .attr("fill", "none")
        .attr("stroke", theme.selectionStroke)
        .attr("stroke-width", 2);
    
    // Image Clip Path
    const clipId = (d: MindNode) => `clip-${d.id}`;
    nodeEnter.append("clipPath").attr("id", d => clipId(d))
       .append("circle").attr("r", 58); // Slightly smaller than node

    // Image
    nodeEnter.append("image")
        .attr("class", "node-image")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", d => `url(#${clipId(d)})`);

    // Content (Text)
    const fo = nodeEnter.append("foreignObject").attr("class", "node-content").style("pointer-events", "none");
    fo.append("xhtml:div").attr("class", "flex flex-col items-center justify-center text-center w-full h-full p-1 select-none node-details");

    const nodeMerge = nodeEnter.merge(nodeSelection);
    
    // IMPORTANT: Re-bind events here so that updated callbacks (like changing language) are applied to existing nodes
    nodeMerge
      .on("click", (e, d) => { if (!e.defaultPrevented) onNodeClick(d.id); })
      .on("contextmenu", (e, d) => { e.preventDefault(); onNodeRightClick(d.id); });

    const getRadius = (d: MindNode) => (d.selected || d.type === 'root' ? 60 : 45);

    // Update Visuals based on Theme & State
    nodeMerge.select(".node-bg")
      .transition().duration(300)
      .attr("r", d => getRadius(d))
      .attr("stroke", d => d.selected ? theme.selectionStroke : (d.type === 'root' ? theme.strokeRoot : theme.strokeChild))
      .attr("stroke-width", d => d.selected ? 3 : 2)
      .attr("fill", d => d.selected ? theme.nodeFillSelected : theme.nodeFill);

    // Dynamic Pulse Animation Logic
    nodeMerge.select(".pulse-group")
      .attr("opacity", d => d.loading ? 1 : 0);

    nodeMerge.select(".pulse-ring")
      .attr("r", d => getRadius(d))
      .attr("stroke", theme.selectionStroke)
      .classed("animate-pulse-ring", d => d.loading);

    nodeMerge.select(".node-image")
       .attr("x", d => -getRadius(d))
       .attr("y", d => -getRadius(d))
       .attr("width", d => getRadius(d) * 2)
       .attr("height", d => getRadius(d) * 2)
       .attr("opacity", d => d.imageUrl ? 0.9 : 0)
       .attr("href", d => d.imageUrl || "");
    
    // Reset clip path radius
    nodeMerge.select("clipPath circle").attr("r", d => getRadius(d));

    nodeMerge.select("foreignObject")
      .attr("width", d => getRadius(d) * 2)
      .attr("height", d => getRadius(d) * 2)
      .attr("x", d => -getRadius(d))
      .attr("y", d => -getRadius(d));

    nodeMerge.select("div")
      .html(d => `
        <div class="flex flex-col items-center justify-center h-full px-1 ${d.imageUrl ? 'bg-black/40 backdrop-blur-[2px] rounded-full text-white' : ''}">
            <span style="color: ${d.imageUrl ? '#fff' : theme.textPrimary}" class="font-bold leading-tight w-full break-words ${d.selected ? 'text-sm' : 'text-xs'}">${d.text}</span>
            <span style="color: ${d.imageUrl ? '#ddd' : theme.textSecondary}" class="font-medium tracking-wide w-full break-words leading-none uppercase opacity-80 text-[8px] mt-1">${d.translation}</span>
        </div>
      `);

    // Tick Function
    simulation.on("tick", () => {
      // Bezier Curve Logic
      linkMerge.attr("d", (d: any) => {
          const source = d.source;
          const target = d.target;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dr = Math.sqrt(dx * dx + dy * dy);
          // Quadratic bezier: control point is perpendicular to midpoint
          const qx = (source.x + target.x) / 2 - dy * 0.1; // Curvature factor
          const qy = (source.y + target.y) / 2 + dx * 0.1;
          return `M${source.x},${source.y} Q${qx},${qy} ${target.x},${target.y}`;
      });

      nodeMerge.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    simulation.alpha(0.3).restart();

  }, [nodes, links, width, height, isDarkMode, onNodeClick, onNodeRightClick]);

  return (
    <div className="w-full h-full relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
       <style>{`
            @keyframes pulse-ring {
              0% { transform: scale(1); opacity: 0.8; stroke-width: 3px; }
              100% { transform: scale(1.35); opacity: 0; stroke-width: 0px; }
            }
            .animate-pulse-ring {
              animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              transform-origin: center;
              transform-box: fill-box;
            }
        `}</style>
      <svg ref={svgRef} width={width} height={height} className="w-full h-full block touch-none cursor-move" />
    </div>
  );
});