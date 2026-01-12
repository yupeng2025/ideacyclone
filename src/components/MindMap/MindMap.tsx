import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { MindNode, MindLink } from '../../types';

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
    onNodeRightClick: (nodeId: string, x: number, y: number) => void;
    onNodeToggle?: (nodeId: string, expanded: boolean) => void;
    onBoxSelect?: (nodeIds: string[]) => void;
    onNodeDragEnd?: (nodes: { id: string, x: number, y: number }[]) => void;
    width: number;
    height: number;
    isDarkMode: boolean;
}

// 扩展 MindNode 类型以包含 D3 Tree 需要的属性
interface TreeMindNode extends d3.HierarchyPointNode<MindNode> {
    x0?: number;
    y0?: number;
    _children?: TreeMindNode[]; // 用于存储折叠的子节点
}

// 选择框状态类型
interface SelectionBox {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

// 节点位置缓存类型
interface NodePosition {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const MindMap = forwardRef<MindMapRef, MindMapProps>(({
    nodes,
    links,
    onNodeClick,
    onNodeRightClick,
    onNodeToggle,
    onBoxSelect,
    onNodeDragEnd,
    width,
    height,
    isDarkMode
}, ref) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);

    // 框选状态
    const [isBoxSelecting, setIsBoxSelecting] = useState(false);
    const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

    // 存储节点位置（用于碰撞检测）
    const nodePositionsRef = useRef<NodePosition[]>([]);

    // 存储当前 transform（用于坐标转换）
    const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);

    // Theme Configuration
    const theme = {
        bg: isDarkMode ? '#111827' : '#f8fafc',
        nodeFill: isDarkMode ? '#1F2937' : '#ffffff',
        nodeFillSelected: isDarkMode ? '#374151' : '#f1f5f9',
        textPrimary: isDarkMode ? '#F9FAFB' : '#0f172a',
        textSecondary: isDarkMode ? '#9CA3AF' : '#475569',
        stroke: isDarkMode ? '#4B5563' : '#cbd5e1',
        selection: '#60A5FA',
        rootFill: isDarkMode ? '#374151' : '#4F46E5',
        rootText: isDarkMode ? '#F9FAFB' : '#FFFFFF',
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
                    d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
                );
            }
        },
        focusNode: (nodeId: string) => {
            // Implementation depends on finding the node's new coordinates from D3 Tree
        },
        exportToImage: async () => {
            if (!svgRef.current) throw new Error("Canvas not ready");
            const svgElement = svgRef.current;
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svgElement);
            if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
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

    // Refs for callbacks
    const onNodeClickRef = useRef(onNodeClick);
    const onNodeRightClickRef = useRef(onNodeRightClick);
    const onNodeToggleRef = useRef(onNodeToggle);
    const onBoxSelectRef = useRef(onBoxSelect);
    const onNodeDragEndRef = useRef(onNodeDragEnd);

    useEffect(() => {
        onNodeClickRef.current = onNodeClick;
        onNodeRightClickRef.current = onNodeRightClick;
        onNodeToggleRef.current = onNodeToggle;
        onBoxSelectRef.current = onBoxSelect;
        onNodeDragEndRef.current = onNodeDragEnd;
    }, [onNodeClick, onNodeRightClick, onNodeToggle, onBoxSelect, onNodeDragEnd]);

    // 框选事件处理
    const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        // 只在空白区域开始框选（不在节点上）
        if ((e.target as Element).closest('.node')) return;
        // 只响应左键
        if (e.button !== 0) return;

        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsBoxSelecting(true);
        setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (!isBoxSelecting || !selectionBox) return;

        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelectionBox(prev => prev ? { ...prev, endX: x, endY: y } : null);
    }, [isBoxSelecting, selectionBox]);

    const handleMouseUp = useCallback(() => {
        if (!isBoxSelecting || !selectionBox) {
            setIsBoxSelecting(false);
            setSelectionBox(null);
            return;
        }

        // 计算选择框在画布坐标系中的位置
        const transform = transformRef.current;
        const boxLeft = Math.min(selectionBox.startX, selectionBox.endX);
        const boxRight = Math.max(selectionBox.startX, selectionBox.endX);
        const boxTop = Math.min(selectionBox.startY, selectionBox.endY);
        const boxBottom = Math.max(selectionBox.startY, selectionBox.endY);

        // 转换为画布坐标
        const canvasBoxLeft = (boxLeft - transform.x) / transform.k;
        const canvasBoxRight = (boxRight - transform.x) / transform.k;
        const canvasBoxTop = (boxTop - transform.y) / transform.k;
        const canvasBoxBottom = (boxBottom - transform.y) / transform.k;

        // 碰撞检测：找出在选择框内的节点
        const selectedIds: string[] = [];
        nodePositionsRef.current.forEach(node => {
            // 节点的屏幕坐标（注意 D3 tree 的 x 是垂直方向，y 是水平方向）
            const nodeLeft = node.y - 10;  // rect x offset is -10
            const nodeRight = node.y + node.width - 10;
            const nodeTop = node.x - 20;   // rect y offset is -20
            const nodeBottom = node.x + 20; // height is 40

            // 检查矩形是否相交
            if (nodeRight >= canvasBoxLeft && nodeLeft <= canvasBoxRight &&
                nodeBottom >= canvasBoxTop && nodeTop <= canvasBoxBottom) {
                selectedIds.push(node.id);
            }
        });

        // 判断是否为点击操作 (移动距离很小)
        const isClick = Math.abs(selectionBox.endX - selectionBox.startX) < 5 &&
            Math.abs(selectionBox.endY - selectionBox.startY) < 5;

        // 如果是点击背景 (没有选中任何节点且是点击操作)，则不触发清除/更新选择
        if (isClick && selectedIds.length === 0) {
            setIsBoxSelecting(false);
            setSelectionBox(null);
            return;
        }

        // 调用回调
        if (onBoxSelectRef.current) {
            onBoxSelectRef.current(selectedIds);
        }

        setIsBoxSelecting(false);
        setSelectionBox(null);
    }, [isBoxSelecting, selectionBox]);

    // 处理鼠标离开 SVG 区域
    const handleMouseLeave = useCallback(() => {
        if (isBoxSelecting) {
            handleMouseUp();
        }
    }, [isBoxSelecting, handleMouseUp]);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        let g = svg.select<SVGGElement>(".main-group");
        if (g.empty()) {
            // Define gradients and filters
            const defs = svg.append("defs");

            // 1. Drop Shadow (Soft, High-end)
            const shadow = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "180%")
                .attr("width", "180%")
                .attr("x", "-40%")
                .attr("y", "-40%");

            shadow.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 4)
                .attr("result", "blur");

            shadow.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 0)
                .attr("dy", 4) // slight vertical offset
                .attr("result", "offsetBlur");

            const componentTransfer = shadow.append("feComponentTransfer");
            componentTransfer.append("feFuncA")
                .attr("type", "linear")
                .attr("slope", 0.15); // Very subtle shadow opacity

            const feMerge = shadow.append("feMerge");
            feMerge.append("feMergeNode").attr("in", "componentTransfer");
            feMerge.append("feMergeNode").attr("in", "SourceGraphic");

            // 2. Gradients
            // Root Gradient (Purple-ish)
            const rootGrad = defs.append("linearGradient")
                .attr("id", "grad-root")
                .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
            rootGrad.append("stop").attr("offset", "0%").attr("stop-color", "#8B5CF6");
            rootGrad.append("stop").attr("offset", "100%").attr("stop-color", "#6366F1");

            // Selected Gradient (Blue-ish)
            const selGrad = defs.append("linearGradient")
                .attr("id", "grad-selected")
                .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
            selGrad.append("stop").attr("offset", "0%").attr("stop-color", "#3B82F6");
            selGrad.append("stop").attr("offset", "100%").attr("stop-color", "#2563EB");

            g = svg.append("g").attr("class", "main-group");

            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.1, 4])
                .filter((event) => {
                    // 触控事件始终允许 (Touch always allowed)
                    if (event.type === 'touchstart' || event.type === 'touchmove') return true;

                    // Prevent Right Click (2) from triggering pan/zoom context menu conflict
                    if (event.button === 2) return false;

                    // 兼容 Pointer Events (iPad/Mobile with Mouse)
                    const isDown = event.type === 'mousedown' || event.type === 'pointerdown';

                    // 框选逻辑：如果是左键点击空白处，阻止 D3 Zoom，交由 React 处理框选
                    if (isDown && !(event.target as Element).closest('.node')) {
                        // 允许中键 (1) 或其他键进行平移
                        // 只有左键 (0) 被阻止
                        return event.button !== 0;
                    }
                    return true;
                })
                .on("zoom", (event) => {
                    g.attr("transform", event.transform);
                    transformRef.current = event.transform;
                });

            zoomRef.current = zoom;
            svg.call(zoom).on("dblclick.zoom", null);

            svg.call(zoom.transform, d3.zoomIdentity.translate(width / 6, height / 2).scale(0.8));
            transformRef.current = d3.zoomIdentity.translate(width / 6, height / 2).scale(0.8);
        }
        gRef.current = g;

    }, []);

    // Layout Update Effect
    useEffect(() => {
        if (!gRef.current) return;

        const g = gRef.current;
        const duration = 500;

        if (!nodes.length) {
            g.selectAll(".node").transition().duration(duration).attr("opacity", 0).remove();
            g.selectAll(".link").transition().duration(duration).attr("opacity", 0).remove();
            nodePositionsRef.current = [];
            return;
        }

        let linkGroup = g.select<SVGGElement>(".links-group");
        if (linkGroup.empty()) {
            linkGroup = g.append("g").attr("class", "links-group");
        }
        let nodeGroup = g.select<SVGGElement>(".nodes-group");
        if (nodeGroup.empty()) {
            nodeGroup = g.append("g").attr("class", "nodes-group");
        }

        let root: d3.HierarchyNode<MindNode>;
        try {
            if (nodes.filter(n => !n.parentId).length > 1) {
                const virtualRoot: MindNode = { id: 'virtual-root', text: '', explanation: '', type: 'root', selected: false, expanded: true, loading: false };
                const connectedNodes = nodes.map(n => (!n.parentId ? { ...n, parentId: 'virtual-root' } : n));
                root = d3.stratify<MindNode>()
                    .id(d => d.id)
                    .parentId(d => d.parentId)([...connectedNodes, virtualRoot]);
            } else {
                root = d3.stratify<MindNode>()
                    .id(d => d.id)
                    .parentId(d => d.parentId)(nodes);
            }
        } catch (e) {
            console.warn("Stratify failed", e);
            return;
        }

        const treeLayout = d3.tree<MindNode>()
            .nodeSize([100, 300])
            .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

        root.descendants().forEach((d) => {
            // @ts-ignore
            if (d.data.id === 'virtual-root') {
            } else if (d.depth > 0) {
                if (d.data.expanded === false && d.children) {
                    // @ts-ignore
                    d._children = d.children;
                    d.children = null;
                } else if (d.data.expanded === true && (d as any)._children) {
                    d.children = (d as any)._children;
                    // @ts-ignore
                    d._children = null;
                }
            }
        });

        const rootPoint = treeLayout(root);

        // 应用自定义位置 (Override tree layout)
        rootPoint.descendants().forEach(d => {
            if (d.data.id !== 'virtual-root' && d.data.x !== undefined && d.data.y !== undefined) {
                // 注意：D3 tree(horizontal) 输出 d.x 是垂直坐标，d.y 是水平坐标
                // 我们约定 MindNode.x 是水平(Screen X)，MindNode.y 是垂直(Screen Y)
                d.y = d.data.x;
                d.x = d.data.y;
            }
        });

        const nodesData = rootPoint.descendants().filter(d => d.data.id !== 'virtual-root');
        const linksData = rootPoint.links().filter(l => l.source.data.id !== 'virtual-root');

        const node = nodeGroup.selectAll<SVGGElement, d3.HierarchyPointNode<MindNode>>(".node")
            .data(nodesData, (d) => d.data.id);

        const nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("cursor", "grab")
            .attr("transform", d => `translate(${(d.parent as any)?.y0 || d.y},${(d.parent as any)?.x0 || d.x})`)
            .attr("opacity", 0);

        nodeEnter.append("rect")
            .attr("rx", 10) // More rounded
            .attr("ry", 10)
            .attr("height", 42) // Slightly taller
            .attr("y", -21)
            .attr("stroke-width", 1.5); // Thinner, elegant stroke

        const textGroup = nodeEnter.append("g").attr("class", "node-text");
        textGroup.append("text")
            .attr("dy", "0.35em")
            .attr("x", 10)
            .attr("text-anchor", "start")
            .style("font-size", "14px")
            .style("font-weight", "500") // Medium weight for modern look
            .style("letter-spacing", "0.02em")
            .style("user-select", "none");

        const toggleBtn = nodeEnter.append("g")
            .attr("class", "toggle-btn")
            .attr("style", "display: none; cursor: pointer; pointer-events: all;");

        toggleBtn.append("circle")
            .attr("r", 9)
            .attr("fill", isDarkMode ? '#1F2937' : '#ffffff')
            .attr("stroke", theme.rootFill)
            .attr("stroke-width", 2);

        toggleBtn.append("path")
            .attr("d", "M-4,0 L4,0")
            .attr("stroke", theme.rootFill)
            .attr("stroke-width", 2)
            .attr("class", "toggle-icon");

        nodeEnter
            .on("click", (e, d) => {
                if ((e.target as Element).closest(".toggle-btn")) return;
                onNodeClickRef.current(d.data.id);
            })
            .on("contextmenu", (e, d) => {
                e.preventDefault();
                onNodeRightClickRef.current(d.data.id, e.clientX, e.clientY);
            });

        const drag = d3.drag<SVGGElement, d3.HierarchyPointNode<MindNode>>()
            .on("start", (event, d) => {
                if (event.sourceEvent && event.sourceEvent.stopPropagation) {
                    event.sourceEvent.stopPropagation();
                }
                d3.select(event.source).attr("cursor", "grabbing");
            })
            .on("drag", function (event, d) {
                const dx = event.dx;
                const dy = event.dy;

                // 如果当前节点被选中，则移动所有选中的节点
                if (d.data.selected) {
                    // 获取所有选中的节点
                    const selectedNodeIds = new Set(nodes.filter(n => n.selected).map(n => n.id));

                    // 移动所有选中的节点
                    nodeGroup.selectAll<SVGGElement, d3.HierarchyPointNode<MindNode>>(".node")
                        .filter(nodeD => selectedNodeIds.has(nodeD.data.id))
                        .each(function (nodeD) {
                            nodeD.y += dx;
                            nodeD.x += dy;
                            d3.select(this).attr("transform", `translate(${nodeD.y},${nodeD.x})`);
                        });

                    // 更新所有相关的连接线
                    g.selectAll<SVGPathElement, d3.HierarchyLink<MindNode>>(".link")
                        .filter(l => selectedNodeIds.has(l.source.data.id) || selectedNodeIds.has(l.target.data.id))
                        .attr("d", linkGen as any);
                } else {
                    // 如果当前节点未被选中，只移动当前节点
                    d.y += dx;
                    d.x += dy;
                    d3.select(this).attr("transform", `translate(${d.y},${d.x})`);
                    g.selectAll<SVGPathElement, d3.HierarchyLink<MindNode>>(".link")
                        .filter(l => l.source === d || l.target === d)
                        .attr("d", linkGen as any);
                }
            })
            .on("end", (event, d) => {
                d3.select(event.source).attr("cursor", "grab");

                const updates: { id: string, x: number, y: number }[] = [];

                if (d.data.selected) {
                    // 多选拖拽结束
                    const selectedNodeIds = new Set(nodes.filter(n => n.selected).map(n => n.id));
                    nodeGroup.selectAll<SVGGElement, d3.HierarchyPointNode<MindNode>>(".node")
                        .filter(nodeD => selectedNodeIds.has(nodeD.data.id))
                        .each((nodeD) => {
                            updates.push({
                                id: nodeD.data.id,
                                x: nodeD.y, // Screen X
                                y: nodeD.x  // Screen Y
                            });
                        });
                } else {
                    // console.log('Single drag end:', d);
                    updates.push({
                        id: d.data.id,
                        x: d.y,
                        y: d.x
                    });
                }

                if (onNodeDragEndRef.current && updates.length > 0) {
                    onNodeDragEndRef.current(updates);
                }
            });

        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition().duration(duration)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("opacity", 1);

        toggleBtn.on("click", (e, d) => {
            e.stopPropagation();
            if (onNodeToggleRef.current) {
                const nextState = !d.data.expanded;
                onNodeToggleRef.current(d.data.id, nextState);
            }
        });

        // Update drag listener for all nodes to ensure they have the latest "nodes" state closure
        nodeUpdate.call(drag as any);

        // 清空并重新收集节点位置
        const newPositions: NodePosition[] = [];

        nodeUpdate.each(function (d) {
            const group = d3.select(this);
            const isRoot = d.data.type === 'root';
            const isSelected = d.data.selected;

            // Robust text selection
            const textEl = group.select<SVGTextElement>(".node-text text");
            textEl.text(d.data.text);

            // Measure text width with fallback
            let textWidth = 0;
            try {
                textWidth = textEl.node()?.getComputedTextLength() || 0;
            } catch (e) {
                // Ignore measurement errors
            }

            // Fallback strategy if measurement fails or returns 0 (common in some rendering contexts)
            if (textWidth === 0 && d.data.text && d.data.text.length > 0) {
                // Approximate width: CJK ~14px, ASCII ~9px
                // This prevents "empty box" issue
                const isASCII = /^[\x00-\x7F]*$/.test(d.data.text);
                textWidth = d.data.text.length * (isASCII ? 9 : 15);
            }

            const pad = 24;
            const rectWidth = textWidth + pad * 2;

            (d as any).width = rectWidth;

            // 收集节点位置
            newPositions.push({
                id: d.data.id,
                x: d.x,
                y: d.y,
                width: rectWidth,
                height: 40
            });

            group.select("rect")
                .attr("width", rectWidth)
                .attr("x", -12) // Slightly more padding left
                .attr("fill", isRoot ? "url(#grad-root)" : (isSelected ? "url(#grad-selected)" : theme.nodeFill))
                .attr("stroke", isSelected ? "white" : (isRoot ? "none" : theme.stroke)) // Clean white stroke for selected
                .attr("stroke-opacity", isSelected ? 0.8 : (isDarkMode ? 0.4 : 0.8)) // Subtle stroke opacity
                .attr("filter", "url(#drop-shadow)") // Apply shadow
                .transition().duration(duration);

            textEl.attr("fill", isRoot && !isSelected ? theme.rootText : theme.textPrimary);

            const hasChildren = (d.children && d.children.length > 0) || ((d as any)._children && (d as any)._children.length > 0);
            const btn = group.select(".toggle-btn");

            // Loading Spinner Selection & Creation
            let spinner = group.select<SVGGElement>(".loading-spinner");
            if (spinner.empty()) {
                spinner = group.append("g")
                    .attr("class", "loading-spinner")
                    .attr("display", "none");

                spinner.append("circle")
                    .attr("r", 8)
                    .attr("fill", "none")
                    .attr("stroke", isDarkMode ? "#60A5FA" : "#3B82F6")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "12 12") // Dashed line for rotation effect
                    .attr("opacity", 0.8);

                // Add rotation animation
                const animate = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
                animate.setAttribute("attributeName", "transform");
                animate.setAttribute("type", "rotate");
                animate.setAttribute("from", "0 0 0");
                animate.setAttribute("to", "360 0 0");
                animate.setAttribute("dur", "1s");
                animate.setAttribute("repeatCount", "indefinite");
                spinner.node()?.appendChild(animate);
            }

            // Logic: If loading, show spinner. Else if children, show toggle btn.
            if (d.data.loading) {
                spinner.attr("display", "block")
                    .attr("transform", `translate(${rectWidth}, 0)`);
                btn.style("display", "none"); // Hide toggle button if loading
            } else {
                spinner.attr("display", "none");
                if (hasChildren) {
                    const isCollapsed = !(d.children && d.children.length > 0);
                    btn.style("display", "block")
                        .attr("transform", `translate(${rectWidth}, 0)`);

                    const icon = btn.select(".toggle-icon");
                    if (isCollapsed) {
                        icon.attr("d", "M-4,0 L4,0 M0,-4 L0,4");
                    } else {
                        icon.attr("d", "M-4,0 L4,0");
                    }
                } else {
                    btn.style("display", "none");
                }
            }
        });

        // 更新节点位置缓存
        nodePositionsRef.current = newPositions;

        node.exit().transition().duration(duration)
            .attr("transform", d => `translate(${(d.parent as any)?.y || d.y},${(d.parent as any)?.x || d.x})`)
            .attr("opacity", 0)
            .remove();

        const linkGen = d3.linkHorizontal<d3.HierarchyPointNode<MindNode>, d3.HierarchyPointNode<MindNode>>()
            .x(d => d.y)
            .y(d => d.x)
            .source(d => {
                const w = (d.source as any).width || 100;
                return { x: d.source.x, y: d.source.y + w - 10 };
            })
            .target(d => {
                return { x: d.target.x, y: d.target.y - 10 };
            });

        const link = linkGroup.selectAll<SVGPathElement, d3.HierarchyLink<MindNode>>(".link")
            .data(linksData, (d) => `${d.source.data.id}-${d.target.data.id}`);

        link.enter().append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", theme.stroke)
            .attr("stroke-width", 2)
            .attr("opacity", 0)
            .attr("d", d => {
                const src = d.source as any;
                const o = { x: src.x0 || src.x, y: src.y0 || src.y };
                if (src.x0 === undefined) {
                    return `M${src.y},${src.x} C${src.y},${src.x} ${src.y},${src.x} ${src.y},${src.x}`;
                }
                return `M${o.y},${o.x} C${o.y},${o.x} ${o.y},${o.x} ${o.y},${o.x}`;
            })
            .merge(link)
            .transition().duration(duration)
            .attr("stroke", theme.stroke)
            .attr("d", linkGen as any)
            .attr("opacity", 1);

        link.exit().transition().duration(duration)
            .attr("d", d => {
                const src = d.source as any;
                const o = { x: src.x, y: src.y };
                return `M${o.y},${o.x} C${o.y},${o.x} ${o.y},${o.x} ${o.y},${o.x}`;
            })
            .attr("opacity", 0)
            .remove();

        nodesData.forEach((d: any) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    }, [nodes, width, height, isDarkMode, theme]);

    // 计算选择框的位置和尺寸
    const boxStyle = selectionBox ? {
        x: Math.min(selectionBox.startX, selectionBox.endX),
        y: Math.min(selectionBox.startY, selectionBox.endY),
        width: Math.abs(selectionBox.endX - selectionBox.startX),
        height: Math.abs(selectionBox.endY - selectionBox.startY)
    } : null;

    return (
        <div
            className="w-full h-full relative overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: theme.bg }}
            role="img"
            aria-label="Mind map visualization"
        >
            <svg
                ref={svgRef}
                width={width}
                height={height}
                className="w-full h-full block touch-none cursor-move mind-map-svg"
                aria-hidden="true"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            />
            {/* 选择框覆盖层 */}
            {boxStyle && boxStyle.width > 5 && boxStyle.height > 5 && (
                <svg
                    className="absolute top-0 left-0 pointer-events-none"
                    width={width}
                    height={height}
                    style={{ zIndex: 100 }}
                >
                    <rect
                        x={boxStyle.x}
                        y={boxStyle.y}
                        width={boxStyle.width}
                        height={boxStyle.height}
                        fill="rgba(96, 165, 250, 0.15)"
                        stroke="#60A5FA"
                        strokeWidth="2"
                        strokeDasharray="6,3"
                        rx="4"
                        ry="4"
                    />
                </svg>
            )}
        </div>
    );
});

MindMap.displayName = 'MindMap';

