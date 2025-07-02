import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Toolbar = ({ 
  onAddTable, 
  onSave, 
  onLoad, 
  onExport, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset,
  onClear,
  onSearch,
  onToggleMinimap,
  onToggleSnapToGrid,
  onAutoLayout,
  searchTerm = '',
  showMinimap = false,
  snapToGrid = false,
  zoom = 100,
  hasUnsavedChanges = false 
}) => {
  return (
<motion.div
    className="glass border-b border-white/10 p-3 sm:p-4 container-responsive"
    initial={{
        y: -100,
        opacity: 0
    }}
    animate={{
        y: 0,
        opacity: 1
    }}
    transition={{
        duration: 0.5
    }}>
    <div
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center">
                <div
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-secondary rounded-lg mr-2 sm:mr-3 glow-primary"></div>
                <h1 className="text-lg sm:text-xl font-display font-bold text-white">Schema Flow</h1>
            </div>
            {/* Search Bar */}
            <div className="relative w-full sm:w-64 lg:w-48 xl:w-64">
                <input
                    type="text"
                    placeholder="Search tables, columns..."
                    value={searchTerm}
                    onChange={e => onSearch && onSearch(e.target.value)}
                    className="w-full px-3 py-2 pl-10 bg-surface border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm mobile-touch-target" />
                <ApperIcon
                    name="Search"
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && <button
                    onClick={() => onSearch && onSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white mobile-touch-target">
                    <ApperIcon name="X" size={14} />
                </button>}
            </div>
        </div>
        <div
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 lg:gap-1">
            <div className="flex items-center gap-1 flex-wrap">
                <Button
                    variant="accent"
                    icon="Plus"
                    onClick={onAddTable}
                    size="sm"
                    className="w-full sm:w-auto">
                    <span className="sm:hidden">Add</span>
                    <span className="hidden sm:inline">Add Table</span>
                </Button>
                <Button variant="ghost" icon="Save" onClick={onSave} size="sm">Save {hasUnsavedChanges && <span className="w-2 h-2 bg-accent rounded-full ml-1"></span>}
                </Button>
                <Button variant="ghost" icon="FolderOpen" onClick={onLoad} size="sm">
                    <span className="sm:hidden">Load</span>
                    <span className="hidden sm:inline">Load</span>
                </Button>
                <Button variant="ghost" icon="Download" onClick={onExport} size="sm">
                    <span className="sm:hidden">Export</span>
                    <span className="hidden sm:inline">Export SQL</span>
                </Button>
            </div>
            {/* View Controls */}
            <div className="flex items-center gap-1 flex-wrap">
                <Button
                    variant={showMinimap ? "primary" : "ghost"}
                    icon="Map"
                    onClick={onToggleMinimap}
                    size="sm"
                    title="Toggle Minimap">
                    <span className="hidden lg:inline">Map</span>
                </Button>
                <Button
                    variant={snapToGrid ? "primary" : "ghost"}
                    icon="Grid3X3"
                    onClick={onToggleSnapToGrid}
                    size="sm"
                    title="Snap to Grid">
                    <span className="hidden lg:inline">Grid</span>
                </Button>
                <Button
                    variant="ghost"
                    icon="Shuffle"
                    onClick={onAutoLayout}
                    size="sm"
                    title="Auto Layout">
                    <span className="hidden lg:inline">Layout</span>
                </Button>
            </div>
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-surface/50 rounded-lg p-1">
                <Button
                    variant="ghost"
                    icon="Minus"
                    onClick={onZoomOut}
                    size="sm"
                    title="Zoom Out">
                    <span className="sr-only">Zoom Out</span>
                </Button>
                <span
                    className="text-xs sm:text-sm text-gray-400 px-2 min-w-[50px] sm:min-w-[60px] text-center font-mono">
                    {zoom}%
                                </span>
                <Button variant="ghost" icon="Plus" onClick={onZoomIn} size="sm" title="Zoom In">
                    <span className="sr-only">Zoom In</span>
                </Button>
                <Button
                    variant="ghost"
                    icon="RotateCcw"
                    onClick={onZoomReset}
                    size="sm"
                    title="Reset Zoom">
                    <span className="hidden sm:inline">Reset</span>
                </Button>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xs text-gray-500 hidden xl:flex items-center gap-2">
                <kbd
                    className="px-2 py-1 bg-surface/50 rounded border border-white/20 text-xs">Ctrl + N</kbd>
                <span className="text-xs">New</span>
                <span className="mx-1">•</span>
                <kbd
                    className="px-2 py-1 bg-surface/50 rounded border border-white/20 text-xs">Ctrl + S</kbd>
                <span className="text-xs">Save</span>
            </div>
            <Button
                variant="outline"
                icon="Trash2"
                onClick={onClear}
                size="sm"
                title="Clear All Tables">
                <span className="sm:hidden">Clear</span>
                <span className="hidden sm:inline">Clear All</span>
            </Button>
        </div>
    </div>
</motion.div>
  )
}

export default Toolbar