"use client";

import { useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type AnimatedTab = string | {
  value: string;
  label: string;
  href?: string;
};

type AnimatedTabsProps = {
  tabs: Array<AnimatedTab>;
  variant?: "default" | "underline";
  activeTab?: string;
  className?: string;
  triggerClassName?: string;
  onTabChange?: (value: string) => void;
};

const getTabValue = (tab: AnimatedTab) => typeof tab === "string" ? tab : tab.value;
const getTabLabel = (tab: AnimatedTab) => typeof tab === "string" ? tab : tab.label;
const getTabHref = (tab: AnimatedTab) => typeof tab === "string" ? undefined : tab.href;

const AnimatedTabs = ({
  tabs,
  variant = "default",
  activeTab,
  className,
  triggerClassName,
  onTabChange,
}: AnimatedTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(() => getTabValue(tabs[0] ?? ""));
  const currentActiveTab = activeTab ?? internalActiveTab;
  const handleTabClick = (value: string, hasHref: boolean, event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    setInternalActiveTab(value);
    onTabChange?.(value);
    if (!hasHref) event.currentTarget.blur();
  };

  if (variant === "underline") {
    return (
      <div className={cn("relative flex items-center border-b border-border", className)}>
        {tabs.map((tab, index) => {
          const value = getTabValue(tab);
          const label = getTabLabel(tab);
          const href = getTabHref(tab);
          const isActive = currentActiveTab === value;
          const Trigger = href ? "a" : "button";

          return (
            <Trigger
              key={index}
              {...(href ? { href } : { type: "button" })}
              onClick={(event) => handleTabClick(value, Boolean(href), event)}
              aria-current={isActive ? "location" : undefined}
              data-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex h-10 items-center px-4 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
                triggerClassName,
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Trigger>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("relative mx-auto flex w-fit items-center rounded-full bg-background p-1", className)}>
      {tabs.map((tab, index) => {
        const value = getTabValue(tab);
        const label = getTabLabel(tab);
        const href = getTabHref(tab);
        const isActive = currentActiveTab === value;
        const Trigger = href ? "a" : "button";

        return (
          <Trigger
            key={index}
            {...(href ? { href } : { type: "button" })}
            onClick={(event) => handleTabClick(value, Boolean(href), event)}
            aria-current={isActive ? "location" : undefined}
            data-current={isActive ? "true" : undefined}
            className={cn(
              "relative flex h-8 items-center rounded-full px-3 text-sm font-medium transition-colors duration-200",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
              triggerClassName,
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-background"
                className="absolute inset-0 rounded-full bg-[#1E1E20]"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </Trigger>
        );
      })}
    </div>
  );
};

export default AnimatedTabs;
