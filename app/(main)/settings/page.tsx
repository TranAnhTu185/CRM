"use client";

import { FloatingIndicator, Tabs } from "@mantine/core";
import { useState } from "react";
import classes from './setting.module.css';
import Employee from "./employee/page";
import Permission from "./permission/page";
import JobPossition from "./job_position/page";
import Department from "./department/page";


export default function SettingsComponent() {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [value, setValue] = useState<string | null>('3');
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };

    return (
        <Tabs variant="none" value={value} onChange={setValue}  orientation="vertical">
            <Tabs.List ref={setRootRef} className={`${classes.list} pt-6`}>
                <Tabs.Tab value="1" ref={setControlRef('1')} className={classes.tab}>
                    Phòng ban
                </Tabs.Tab>
                <Tabs.Tab value="2" ref={setControlRef('2')} className={classes.tab}>
                   Vị trí công việc 
                </Tabs.Tab>
                <Tabs.Tab value="3" ref={setControlRef('3')} className={classes.tab}>
                    Nhận sự
                </Tabs.Tab>
                <Tabs.Tab value="4" ref={setControlRef('4')} className={classes.tab}>
                    Vai trò
                </Tabs.Tab>

                <FloatingIndicator
                    target={value ? controlsRefs[value] : null}
                    parent={rootRef}
                    className={classes.indicator}
                />
            </Tabs.List>

            <Tabs.Panel value="1">
                <div className="p-6">
                    <Department/>
                </div>
            </Tabs.Panel>
            <Tabs.Panel value="2">
                <div className="p-6">
                    <JobPossition/>
                </div>
            </Tabs.Panel>
            <Tabs.Panel value="3">
                <div className="p-6">
                    <Employee/>
                </div>
            </Tabs.Panel>
            <Tabs.Panel value="4">
                 <div className="p-6">
                    <Permission/>
                </div>
            </Tabs.Panel>
        </Tabs>
    );
}