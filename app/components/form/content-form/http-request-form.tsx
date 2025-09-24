"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import { IconEye, IconTrash } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

const HttpRequestForm = forwardRef<childProps, ChildFormProps>(({ data, onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const [activeTab, setActiveTab] = useState<string | null>("body");

    const [bodyType, setBodyType] = useState(["Raw", "Form-data", "x-www-form-urlencoded"]);

    const [name, setName] = useState("");
    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            const { hasErrors } = form.validate();
            if (!hasErrors) {
                onSubmit(form.values);
            }
        },
    }));


    const initData = () => {
        if (data && data.info) {
            form.setValues({
                name: data.info.name,
                description: data.info.description,
                url: data.info.url,
                method: data.info.method,
                bodyType: data.info.bodyType,
                bodyContent: data.info.bodyContent,
                dataSource: data.info.dataSource,
                bodyText: data.info.bodyText,
                bodyContentArr: data.info.bodyContentArr,
                headers: data.info.headers,
                query: data.info.query,
                parseResponse: data.info.parseResponse,
                timeout: data.info.timeout,
                retry: data.info.retry,
                waitForResponse: data.info.waitForResponse,
                continueOnError: data.info.continueOnError,
            });
        }
    };


    useEffect(() => {
        initData();
    }, [data])


    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            url: "",
            method: "POST",
            bodyType: "Raw",
            bodyContent: "JSON (application/json)",
            dataSource: "Văn bản thuần",
            bodyText: "",
            bodyContentArr: [{ key: "", value: "" }],
            headers: [{ key: "", value: "", hidden: false }],
            query: [{ key: "", value: "" }],
            parseResponse: "json",
            timeout: 10,
            retry: 1,
            waitForResponse: true,
            continueOnError: true,
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });

    const addHeader = () => {
        form.insertListItem("headers", { key: "", value: "", hidden: false });
    };

    const removeHeader = (index: number) => {
        form.removeListItem("headers", index);
    };

    const addQuery = () => {
        form.insertListItem("query", { key: "", value: "" });
    };

    const removeQuery = (index: number) => {
        form.removeListItem("query", index);
    };

    const addBody = () => {
        form.insertListItem("bodyContentArr", { key: "", value: "" });
    };

    const removeBody = (index: number) => {
        form.removeListItem("bodyContentArr", index);
    };

    return (
        <Box mx="auto">
            <form>
                {/* Tên */}
                <TextInput
                    label={
                        <span className="text-black">
                            Tên
                        </span>
                    }
                    placeholder="Nhập tên..."
                    {...form.getInputProps("name")}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            {name.length}/{maxNameLength}
                        </Text>
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
                    {...form.getInputProps('description')}
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
                    {...form.getInputProps("url")}
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
                    {...form.getInputProps('method')}
                    onChange={(value) => {
                        form.setFieldValue("method", value || "");
                        // 👇 Tự động set cho input khác
                        if (value === "GET" || value === "DELETE" || value === "HEAD") {
                            setBodyType(["Empty", "Raw", "Form-data", "x-www-form-urlencoded"])
                            form.setFieldValue("bodyType", "Empty");
                        } else {
                            setBodyType(["Raw", "Form-data", "x-www-form-urlencoded"])
                            form.setFieldValue("bodyType", "Raw");
                        }
                    }}
                    withAsterisk
                />

                <Tabs value={activeTab} onChange={setActiveTab} className="p-5 mt-[20px] mb-[20px] bg-[#f6f6fc] rounded-[4px]">
                    <Tabs.List>
                        <Tabs.Tab value="body">Body</Tabs.Tab>
                        <Tabs.Tab value="headers">Headers ({form.values.headers.length})</Tabs.Tab>
                        <Tabs.Tab value="query">Query String ( {form.values.query.length} )</Tabs.Tab>
                    </Tabs.List>

                    {/* BODY TAB */}
                    <Tabs.Panel value="body" pt="md">
                        <Box>
                            <Text fw={500} size="sm" mb={4}>
                                Body type
                            </Text>
                            <Select
                                data={bodyType}
                                {...form.getInputProps("bodyType")}
                                mb="md"
                            // disabled={form.values.method === "GET"}
                            />
                            {form.values.bodyType === "Raw" &&
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
                                        {...form.getInputProps("bodyContent")}
                                        mb="md"
                                    />

                                    <Text fw={500} size="sm" mb={4} >
                                        Nguồn dữ liệu
                                    </Text>
                                    <Select
                                        data={["Văn bản thuần", "Sử dụng mẫu văn bản", "Sử dụng tài nguyên hoặc biến khác"]}
                                        {...form.getInputProps("dataSource")}
                                        mb="md"
                                    />

                                    {form.values.dataSource === "Văn bản thuần" && <Textarea
                                        placeholder="Nhập JSON..."
                                        autosize
                                        minRows={8}
                                        {...form.getInputProps("bodyText")}
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

                            {(form.values.bodyType === "Form-data" || form.values.bodyType === "x-www-form-urlencoded") &&
                                <div>
                                    <Group mb="sm" grow>
                                        <Text fw={500} size="sm">Key</Text>
                                        <Text fw={500} size="sm">Value</Text>
                                        <div style={{ width: 40 }} />
                                    </Group>

                                    {form.values.bodyContentArr.map((_, index) => (
                                        <Group key={index} mb="sm" grow align="center">
                                            <TextInput
                                                placeholder="Nhập key"
                                                {...form.getInputProps(`query.${index}.key`)}
                                            />
                                            <TextInput
                                                placeholder="Nhập value"
                                                {...form.getInputProps(`query.${index}.value`)}
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
                        {form.values.headers.map((_, index) => (
                            <Grid key={index}>
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="Nhập key"
                                        {...form.getInputProps(`headers.${index}.key`)}
                                    />
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="Nhập value"
                                        {...form.getInputProps(`headers.${index}.value`)}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1} className="flex items-center justify-center">
                                    <Checkbox
                                        icon={IconEye}
                                        {...form.getInputProps(`headers.${index}.hidden`, {
                                            type: "checkbox",
                                        })}
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

                        {form.values.query.map((_, index) => (
                            <Group key={index} mb="sm" grow align="center">
                                <TextInput
                                    placeholder="Nhập key"
                                    {...form.getInputProps(`query.${index}.key`)}
                                />
                                <TextInput
                                    placeholder="Nhập value"
                                    {...form.getInputProps(`query.${index}.value`)}
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
                        <Select
                            label="Parse response"
                            data={[
                                { value: "json", label: "Parse response thành JSON" },
                                { value: "raw", label: "Không Parse response" },
                            ]}
                            {...form.getInputProps("parseResponse")}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <NumberInput
                            label="Timeout (s)"
                            min={1}
                            {...form.getInputProps("timeout")}
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <NumberInput
                            label="Số lần retry"
                            min={0}
                            {...form.getInputProps("retry")}
                        />
                    </Grid.Col>
                </Grid>

                <Checkbox
                    label="Chờ cho đến khi nhận được phản hồi"
                    {...form.getInputProps("waitForResponse", { type: "checkbox" })}
                    mb="sm"
                />

                <Checkbox
                    label="Tiếp tục quy trình kể cả khi request trả về lỗi (non-2xx/3xx response)"
                    {...form.getInputProps("continueOnError", { type: "checkbox" })}
                />

                <Button variant="outline" color="indigo" mb="md" className="mt-[20px]">
                    Cấu hình response mẫu
                </Button>
            </form>
        </Box >
    );
});


HttpRequestForm.displayName = "HttpRequestForm";
export default HttpRequestForm;
