"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    Title,
    Group,
    Button,
    Tabs,
    ActionIcon,
    Checkbox,
    NumberInput,
    Grid,
    ComboboxItem,
    useCombobox,
    Combobox,
    InputBase,
    Input,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import { IconEye, IconTrash } from "@tabler/icons-react";
import { randomId, useListState, useSetState } from "@mantine/hooks";

export const dynamic = "force-dynamic";
interface ContentArr {
    key: string,
    value: string,
    id: string,
}

interface ContentHeaderArr {
    key: string,
    value: string,
    id: string,
    hidden: boolean
}

const HttpRequestForm = forwardRef<childProps, ChildFormProps>(({ dataItem, onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const [activeTab, setActiveTab] = useState<string | null>("body");

    const [bodyType, setBodyType] = useState(["Raw", "Form-data", "x-www-form-urlencoded"]);
    const [valuesBodyContentArr, handlersBodyContentArr] = useListState<ContentArr>(dataItem?.info?.bodyContentArr || [{ key: "", value: "", id: randomId() }]);
    const [valuesQuery, handlersQuery] = useListState<ContentArr>(dataItem?.info?.query || [{ key: "", value: "", id: randomId() }]);
    const [valuesHeader, handlersHeader] = useListState<ContentHeaderArr>(dataItem?.info?.headers || [{ key: "", value: "", hidden: false, id: randomId() }]);
    const [state, setState] = useSetState({
        name: "",
        description: "",
        url: "",
        method: "POST",
        bodyType: "Raw",
        bodyContent: "JSON (application/json)",
        dataSource: "Văn bản thuần",
        bodyText: "",
        bodyContentArr: [],
        headers: [],
        query: [],
        parseResponse: "Parse response thành JSON",
        timeout: 10,
        retry: 1,
        waitForResponse: true,
        continueOnError: true,
    });
    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            // const { hasErrors } = form.validate();
            // if (!hasErrors) {
            // setState({ bodyContentArr: valuesBodyContentArr, headers: valuesHeader, query: valuesQuery });
            // form.values.bodyContentArr = valuesBodyContentArr;
            // form.values.headers = valuesHeader;
            // form.values.query = valuesQuery;
            // form.values.parseResponse = parseResponseSL;
            console.log(state);
            const data = {...state, bodyContentArr: valuesBodyContentArr, headers: valuesHeader, query: valuesQuery};
            console.log(data);
            onSubmit(data);
            // }
        },
    }));

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });


    const initData = () => {
        if (dataItem && dataItem.info) {
            setState({
                name: dataItem.info.name,
                description: dataItem.info.description,
                url: dataItem.info.url,
                method: dataItem.info.method,
                bodyType: dataItem.info.bodyType,
                bodyContent: dataItem.info.bodyContent,
                dataSource: dataItem.info.dataSource,
                bodyText: dataItem.info.bodyText,
                bodyContentArr: dataItem.info.bodyContentArr,
                headers: dataItem.info.headers,
                query: dataItem.info.query,
                parseResponse: dataItem.info.parseResponse,
                timeout: dataItem.info.timeout,
                retry: dataItem.info.retry,
                waitForResponse: dataItem.info.waitForResponse,
                continueOnError: dataItem.info.continueOnError,
            });

        }
    };


    useEffect(() => {
        initData();
    }, [dataItem])


    // const form = useForm({
    //     initialValues: {
    //         name: "",
    //         description: "",
    //         url: "",
    //         method: "POST",
    //         bodyType: "Raw",
    //         bodyContent: "JSON (application/json)",
    //         dataSource: "Văn bản thuần",
    //         bodyText: "",
    //         bodyContentArr: [],
    //         headers: [],
    //         query: [],
    //         parseResponse: "",
    //         timeout: 10,
    //         retry: 1,
    //         waitForResponse: true,
    //         continueOnError: true,
    //     },
    //     validate: {
    //         name: (value) =>
    //             value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

    //     },
    // });

    const addHeader = () => {
        handlersHeader.append({ key: "", value: "", hidden: false, id: randomId() });
        // form.insertListItem("headers", { key: "", value: "", hidden: false });
    };

    const removeHeader = (index: number) => {
        handlersHeader.remove(index, 1);
        // form.removeListItem("headers", index);
    };

    const addQuery = () => {
        handlersQuery.append({ key: "", value: "", id: randomId() });
        // form.insertListItem("query", { key: "", value: "" });
    };

    const removeQuery = (index: number) => {
        handlersQuery.remove(index, 1);
        // form.removeListItem("query", index);
    };

    const addBody = () => {
        handlersBodyContentArr.append({ key: "", value: "", id: randomId() });
        // form.insertListItem("bodyContentArr", { key: "", value: "" });
    };

    const removeBody = (index: number) => {
        handlersBodyContentArr.remove(index, 1);
        // form.removeListItem("bodyContentArr", index);
    };

    return (
        <Box mx="auto">
            {/* Tên */}
            <TextInput
                label={
                    <span className="text-black">
                        Tên
                    </span>
                }
                placeholder="Nhập tên..."
                value={state?.name}
                rightSection={
                    <Text size="xs" c="dimmed">
                        {state?.name.length}/{maxNameLength}
                    </Text>
                }
                onChange={(event) =>
                    setState({ name: event.currentTarget.value })
                }
                rightSectionWidth={70}
                maxLength={maxDescLength}
                withAsterisk
                mb="md"
            />
            {/*Description*/}
            <Textarea
                label="Mô tả"
                rows={3}
                placeholder="Nhập mô tả..."
                mt="sm"
                value={state.description || ""}
                onChange={(event) =>
                    setState({ description: event.currentTarget.value })
                }
            />
            <Divider my="sm" />

            <Title order={3} mb="md">
                Cấu hình HTTP Request
            </Title>

            {/* Request URL */}
            <TextInput
                label={
                    <span className="text-black">
                        Request URL
                    </span>
                }
                placeholder="Nhập request url..."
                // {...form.getInputProps("url")}
                value={state.url || ""}
                onChange={(event) =>
                    setState({ url: event.currentTarget.value })
                }
                withAsterisk
                mb="md"
            />

            {/*Request method*/}
            <Select
                required
                label="Request method"
                placeholder="Chọn ..."
                mt="sm"
                data={[
                    { value: "GET", label: 'GET' },
                    { value: "POST", label: 'POST' },
                    { value: "PUT", label: 'PUT' },
                    { value: "DELETE", label: 'DELETE' },
                    { value: "PATCH", label: 'PATCH' },
                    { value: "HEAD", label: 'HEAD' },
                ]}
                // {...form.getInputProps('method')}
                value={state.method || ""}
                onChange={(value) => {
                    setState({ method: value || "" });
                    // 👇 Tự động set cho input khác
                    if (value === "GET" || value === "DELETE" || value === "HEAD") {
                        setBodyType(["Empty", "Raw", "Form-data", "x-www-form-urlencoded"])
                        setState({ bodyType: "Empty" });
                    } else {
                        setBodyType(["Raw", "Form-data", "x-www-form-urlencoded"])
                        setState({ bodyType: "EmRawpty" });
                    }
                }}
                withAsterisk
            />

            <Tabs value={activeTab} onChange={setActiveTab} className="p-5 mt-[20px] mb-[20px] bg-[#f6f6fc] rounded-[4px]">
                <Tabs.List>
                    <Tabs.Tab value="body">Body</Tabs.Tab>
                    <Tabs.Tab value="headers">Headers ({valuesHeader.length})</Tabs.Tab>
                    <Tabs.Tab value="query">Query String ( {valuesQuery.length} )</Tabs.Tab>
                </Tabs.List>

                {/* BODY TAB */}
                <Tabs.Panel value="body" pt="md">
                    <Box>
                        <Text fw={500} size="sm" mb={4}>
                            Body type
                        </Text>
                        <Select
                            data={bodyType}
                            value={state.bodyType || ''}
                            onChange={(val) => setState({ bodyType: val })}
                            mb="md"
                        // disabled={form.values.method === "GET"}
                        />
                        {state.bodyType === "Raw" &&
                            <div>
                                <Text fw={500} size="sm" mb={4}>
                                    Body content
                                </Text>
                                <Select
                                    data={[
                                        "JSON (application/json)",
                                        "TEXT (text/plain)",
                                        "XML (application/xml)",
                                        "HTML (text/html)",
                                        "XML (text/xml)",
                                    ]}
                                    value={state.bodyContent || ''}
                                    onChange={(val) => setState({ bodyContent: val })}
                                    mb="md"
                                />

                                <Text fw={500} size="sm" mb={4} >
                                    Nguồn dữ liệu
                                </Text>
                                <Select
                                    data={["Văn bản thuần", "Sử dụng mẫu văn bản", "Sử dụng tài nguyên hoặc biến khác"]}
                                    value={state.dataSource || ''}
                                    onChange={(val) => setState({ dataSource: val })}
                                    mb="md"
                                />

                                {state.dataSource === "Văn bản thuần" && <Textarea
                                    placeholder="Nhập JSON..."
                                    autosize
                                    minRows={8}
                                    value={state.bodyText || ''}
                                    onChange={(val) => setState({ bodyText: val.currentTarget.value })}
                                    styles={{
                                        input: {
                                            fontFamily: "monospace",
                                            backgroundColor: "#1e1e1e",
                                            color: "#fff",
                                        },
                                    }}
                                />}
                            </div>
                        }

                        {(state.bodyType === "Form-data" || state.bodyType === "x-www-form-urlencoded") &&
                            <div>
                                <Group mb="sm" grow>
                                    <Text fw={500} size="sm">Key</Text>
                                    <Text fw={500} size="sm">Value</Text>
                                    <div style={{ width: 40 }} />
                                </Group>

                                {valuesBodyContentArr.map((value, index) => (
                                    <Group key={value?.id} mb="sm" grow align="center">
                                        <TextInput
                                            placeholder="Nhập key"
                                            value={value.key}
                                            onChange={(val) => handlersBodyContentArr.setItemProp(index, "key", val.target.value || " ")}
                                        />
                                        <TextInput
                                            placeholder="Nhập value"
                                            value={value.value}
                                            onChange={(val) => handlersBodyContentArr.setItemProp(index, "value", val.target.value || " ")}
                                        />
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            onClick={() => removeBody(index)}
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </Group>
                                ))}

                                <Button
                                    variant="light"
                                    onClick={addBody}
                                    leftSection={<span style={{ fontSize: 18 }}>＋</span>}
                                >
                                    Thêm item
                                </Button>
                            </div>
                        }
                    </Box>
                </Tabs.Panel>

                {/* HEADERS TAB */}
                <Tabs.Panel value="headers" pt="md">
                    <Grid>
                        <Grid.Col span={5}>Key</Grid.Col>
                        <Grid.Col span={5}>Value</Grid.Col>
                        <Grid.Col span={1}>Hidden</Grid.Col>
                        <Grid.Col span={1}></Grid.Col>
                    </Grid>
                    {valuesHeader.map((value, index) => (
                        <Grid key={value.id}>
                            <Grid.Col span={5}>
                                <TextInput
                                    placeholder="Nhập key"
                                    value={value.key}
                                    onChange={(val) => handlersHeader.setItemProp(index, "key", val.target.value || " ")}
                                />
                            </Grid.Col>
                            <Grid.Col span={5}>
                                <TextInput
                                    placeholder="Nhập value"
                                    value={value.value}
                                    onChange={(val) => handlersHeader.setItemProp(index, "value", val.target.value || " ")}
                                // {...form.getInputProps(`headers.${index}.value`)}
                                />
                            </Grid.Col>
                            <Grid.Col span={1} className="flex items-center justify-center">
                                <Checkbox
                                    icon={IconEye}
                                    // value={value.hidden}
                                    checked={value.hidden}
                                    onChange={(val) => handlersHeader.setItemProp(index, "hidden", val.currentTarget.checked)}
                                // {...form.getInputProps(`headers.${index}.hidden`, {
                                //     type: "checkbox",
                                // })}
                                />
                            </Grid.Col>
                            <Grid.Col span={1} className="flex items-center justify-center">
                                <ActionIcon
                                    color="red"
                                    variant="subtle"
                                    onClick={() => removeHeader(index)}
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Grid.Col>
                        </Grid>
                    ))}

                    <Button
                        variant="light" className="mt-[20px]"
                        onClick={addHeader}
                        leftSection={<span style={{ fontSize: 18 }}>＋</span>}
                    >
                        Thêm header
                    </Button>
                </Tabs.Panel>

                {/* QUERY STRING TAB */}
                <Tabs.Panel value="query" pt="md">
                    <Group mb="sm" grow>
                        <Text fw={500} size="sm">Key</Text>
                        <Text fw={500} size="sm">Value</Text>
                        <div style={{ width: 40 }} />
                    </Group>

                    {valuesQuery.map((value, index) => (
                        <Group key={value.id} mb="sm" grow align="center">
                            <TextInput
                                placeholder="Nhập key"
                                value={value.key}
                                onChange={(val) => handlersQuery.setItemProp(index, "key", val.target.value || " ")}
                            />
                            <TextInput
                                placeholder="Nhập value"
                                value={value.value}
                                onChange={(val) => handlersQuery.setItemProp(index, "value", val.target.value || " ")}
                            />
                            <ActionIcon
                                color="red"
                                variant="subtle"
                                onClick={() => removeQuery(index)}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Group>
                    ))}

                    <Button
                        variant="light"
                        onClick={addQuery}
                        leftSection={<span style={{ fontSize: 18 }}>＋</span>}
                    >
                        Thêm param
                    </Button>
                </Tabs.Panel>
            </Tabs>

            <Grid className="pt-[20px] pb-[20px]">
                <Grid.Col span={6}>
                    <Combobox
                        store={combobox}
                        onOptionSubmit={(val) => {
                            setState({ parseResponse: val })
                            combobox.closeDropdown();
                        }}
                    >
                        <Combobox.Target>
                            <TextInput
                                label="Parse response"
                                placeholder="Pick value or type anything"
                                value={state.parseResponse}
                                onChange={(event) => {
                                    setState({ parseResponse: event.currentTarget.value })
                                    combobox.openDropdown();
                                    combobox.updateSelectedOptionIndex();
                                }}
                                onClick={() => combobox.openDropdown()}
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                            />
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>
                                {["Parse response thành JSON", "Không Parse response"].map((item) => (
                                    <Combobox.Option value={item} key={item}>
                                        {item}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                </Grid.Col>
                <Grid.Col span={3}>
                    <NumberInput
                        label="Timeout (s)"
                        min={1}
                        value={state.timeout}
                        onChange={(val: number) => setState({ timeout: val })}
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <NumberInput
                        label="Số lần retry"
                        min={0}
                        value={state.retry}
                        onChange={(val: number) => setState({ retry: val })}
                    />
                </Grid.Col>
            </Grid>

            <Checkbox
                label="Chờ cho đến khi nhận được phản hồi"
                checked={state.waitForResponse}
                onChange={(val) => setState({ waitForResponse: val.currentTarget.checked })}
                mb="sm"
            />

            <Checkbox
                label="Tiếp tục quy trình kể cả khi request trả về lỗi (non-2xx/3xx response)"
                checked={state.continueOnError}
                onChange={(val) => setState({ continueOnError: val.currentTarget.checked })}
            />

            <Button variant="outline" color="indigo" mb="md" className="mt-[20px]">
                Cấu hình response mẫu
            </Button>
        </Box >
    );
});


HttpRequestForm.displayName = "HttpRequestForm";
export default HttpRequestForm;
