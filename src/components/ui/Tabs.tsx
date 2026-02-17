"use client";

import { createContext, useContext, useState, useId } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onChange,
  children,
  className = "",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const baseId = useId();

  const activeTab = value !== undefined ? value : internalValue;
  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={`
        flex gap-1 p-1 rounded-lg
        bg-background-light
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className = "",
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-2 rounded-md text-sm font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background-light
        disabled:cursor-not-allowed disabled:opacity-50
        ${
          isActive
            ? "bg-background-medium text-text-primary shadow-sm"
            : "text-text-muted hover:text-text-primary"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={`mt-4 focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
}

export default Tabs;
