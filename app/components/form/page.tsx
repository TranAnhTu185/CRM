"use client";

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Drawer, Loader } from "@mantine/core";
import { useState } from "react";
import { IconXboxX } from '@tabler/icons-react';

type GoFormProps = {
    elementProp: any; 
};

// Kiểu cho ref (những gì bạn expose ra ngoài)
export type GoFormRef = {
  openModal: () => void;
};


const GoForm = forwardRef<GoFormRef, GoFormProps>((props, ref) => {
     const { elementProp } = props;
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpened(true)
        }
    }));
    return <>
        <Drawer className={'mantine-Drawer-prmu'} size={'60%'} opened={opened} position={'right'} onClose={() => {
            setOpened(false)
        }}
            closeButtonProps={{
                icon: <IconXboxX size={40} stroke={2} style={{ color: "#f90101ff" }} />,
            }}
        >

            <div className="bg-white rounded-2xl contents justify-center px-6 pb-6 w-full max-w-md relative">
                {loading == true && <Loader color="blue" type="dots" />}
                <h2 className="text-center text-xl font-bold text-blue-600 mb-2">Premium Plans</h2>
                <p className="text-center text-sm text-gray-500 font-semibold mb-4">Access to more days in the
                    past<br />More favorites + personal notes!</p>
                <span>{JSON.stringify(elementProp)}</span>

            </div>
        </Drawer>
    </>
});

GoForm.displayName = 'GoPremium';

export default GoForm