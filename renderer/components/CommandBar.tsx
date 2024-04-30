import * as React from "react";
import { CSSProperties } from 'react';

import {
    ActionId,
    KBarAnimator,
    KBarPortal,
    KBarPositioner,
    KBarSearch,
    KBarResults,
    useMatches,
    ActionImpl,
} from "kbar";

const searchStyle = {
    padding: "12px 16px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box" as React.CSSProperties["boxSizing"],
    outline: "none",
    border: "none",
    background: "var(--bg1)",
    color: "var(--fg1)",
};

const animatorStyle = {
    maxWidth: "600px",
    width: "100%",
    background: "var(--bg1)",
    color: "var(--fg1)",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "var(--sd1)",
};

const groupNameStyle = {
    padding: "8px 16px",
    fontSize: "10px",
    textTransform: "uppercase" as const,
    opacity: 0.5,
};

const kbarPositionerStyle: CSSProperties = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 9999,
};

export default function CommandBar() {
    return (
        <KBarPortal>
            <KBarPositioner style={kbarPositionerStyle}>
                <KBarAnimator style={animatorStyle}>
                    <KBarSearch style={searchStyle} />
                    <RenderResults />
                </KBarAnimator>
            </KBarPositioner>
        </KBarPortal>
    );
}

function RenderResults() {
    const { results, rootActionId } = useMatches();

    return (
        <KBarResults
            items={results}
            onRender={({ item, active }) =>
                typeof item === "string" ? (
                    <div style={groupNameStyle}>{item}</div>
                ) : (
                    <ResultItem
                        action={item}
                        active={active}
                        currentRootActionId={rootActionId}
                    />
                )
            }
        />
    );
}

const ResultItem = React.forwardRef(
    (
        {
            action,
            active,
            currentRootActionId,
        }: {
            action: ActionImpl;
            active: boolean;
            currentRootActionId: ActionId;
        },
        ref: React.Ref<HTMLDivElement>
    ) => {
        const ancestors = React.useMemo(() => {
            if (!currentRootActionId) return action.ancestors;
            const index = action.ancestors.findIndex(
                (ancestor) => ancestor.id === currentRootActionId
            );
            // +1 removes the currentRootAction; e.g.
            // if we are on the "Set theme" parent action,
            // the UI should not display "Set theme… > Dark"
            // but rather just "Dark"
            return action.ancestors.slice(index + 1);
        }, [action.ancestors, currentRootActionId]);

        return (
            <div
                ref={ref}
                style={{
                    padding: "12px 16px",
                    background: active ? "var(--a1)" : "transparent",
                    borderLeft: `2px solid ${active ? "var(--fg1)" : "transparent"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        fontSize: 14,
                    }}
                >
                    <div
                        className="flex items-center justify-center"
                        style={{ width: "20px" }}
                    >
                        {action.icon && action.icon}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>
                            {ancestors.length > 0 &&
                                ancestors.map((ancestor) => (
                                    <React.Fragment key={ancestor.id}>
                                        <span
                                            style={{
                                                opacity: 0.5,
                                                marginRight: 8,
                                            }}
                                        >
                                            {ancestor.name}
                                        </span>
                                        <span
                                            style={{
                                                marginRight: 8,
                                            }}
                                        >
                                            &rsaquo;
                                        </span>
                                    </React.Fragment>
                                ))}
                            <span>{action.name}</span>
                        </div>
                        {action.subtitle && (
                            <span style={{ fontSize: 12 }}>{action.subtitle}</span>
                        )}
                    </div>
                </div>
                {action.shortcut?.length ? (
                    <div
                        aria-hidden
                        style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
                    >
                        {action.shortcut.map((sc) => (
                            <kbd
                                key={sc}
                                style={{
                                    padding: "4px 6px",
                                    background: "rgba(0 0 0 / .1)",
                                    borderRadius: "4px",
                                    fontSize: 14,
                                }}
                            >
                                {sc}
                            </kbd>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
);
ResultItem.displayName = "ResultItem";
