'use client';
import {

    Box,
    Button,
    Flex,
    Group,
    MultiSelect, NumberInput,
    Paper, Radio, Select,
    Stack, Tabs,
    Text, Textarea, TextInput,
    Title,

} from "@mantine/core";
import { ComponentData } from "@/app/types/consts";
import {
    IconExclamationCircle, IconMenu2
} from "@tabler/icons-react";
import { DateInput, DateTimePicker } from "@mantine/dates";
import { useStores } from "@/app/store/context";
import { observer } from "mobx-react-lite";
const Process = observer(() => {

    const { userTaskStore } = useStores();

    const isContainer = (type: string) => {
        return ['Layout Row', 'Layout Column', 'Tab Section', 'Tab', 'Section', 'Group'].includes(type);
    };

    const renderComponent = (item: ComponentData) => {
        let componentToRender;
        if (isContainer(item.type)) {
            let colorbg = "white";
            let colortext = "black";

            // ⬇️ apply layout props
            const { showBorder, visible, paddingTop, paddingRight, paddingBottom, paddingLeft, gap, columns, tabOrder } = item.props;

            if (visible === false) {
                return null; // ẩn container nếu unchecked
            }

            let childrenWrapper;
            if (item.children && item.children.length > 0) {
                if (item.type === "Group") {
                    childrenWrapper = (
                        <Flex
                            key={item.id}
                            gap={gap || "md"}
                            wrap="wrap"
                            p="md"
                            direction={tabOrder === "top_bottom" ? "column" : "row"}
                        >
                            {item.children.map((child) => (
                                <Box key={child.id} style={{
                                    flexBasis:
                                        item.props.columns === "2_columns"
                                            ? "calc(50% - var(--mantine-spacing-md) / 2)"
                                            : "100%",
                                    flexGrow: 0,
                                    flexShrink: 0,
                                }} >
                                    {renderComponent(child)}
                                </Box>
                            ))}
                        </Flex>
                    );
                } else if (item.type === "Tab Section") {
                    childrenWrapper = (
                        <Tabs
                            defaultValue={item.children?.[0]?.id}
                            variant="outline"
                            radius="md"
                            keepMounted={false}
                        >
                            <Tabs.List>
                                {item.children?.map((tab) => (
                                    <Tabs.Tab key={tab.id} value={tab.id}>
                                        {tab.props?.label || "Untitled"}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>

                            {item.children?.map((tab) => (
                                <Tabs.Panel key={tab.id} value={tab.id} pt="xs">
                                    <Paper
                                        withBorder
                                        radius="md"
                                        style={{
                                            // borderColor: "var(--mantine-color-red-3)",
                                            // backgroundColor: "var(--mantine-color-red-0)",
                                            minHeight: 100,
                                        }}
                                    >
                                        {tab.children && tab.children.length > 0 ? (
                                            tab.children.map((child) => (
                                                <Box key={child.id}>{renderComponent(child)}</Box>
                                            ))
                                        ) : (
                                            <Text c="dimmed" ta="center">
                                                Kéo Trường từ phía menu trái và thả vào Group.
                                            </Text>
                                        )}
                                    </Paper>
                                </Tabs.Panel>
                            ))}
                        </Tabs>
                    );
                } else {
                    childrenWrapper = (
                        <Stack gap={gap || "md"}>
                            <Title order={3} className="mb-2">{item.props.name || ""}</Title>
                            {item.children.map((child) => (
                                <Box key={child.id}>{renderComponent(child)}</Box>
                            ))}
                        </Stack>
                    );
                }
            } else {
                childrenWrapper = (
                    <Text ta="center" fz="sm" c="gray.5" style={{ minHeight: "50px" }}>
                        Kéo thả các thành phần vào đây
                    </Text>
                );
            }

            return (
                <div>
                    <Paper
                        key={item.id}
                        withBorder={showBorder}
                        style={{
                            paddingTop: item.props.paddingLeft ?? 16,
                            paddingRight: item.props.paddingRight ?? 16,
                            paddingBottom: item.props.paddingBottom ?? 16,
                            paddingLeft: item.props.paddingLeft ?? 16,
                            border: item.props.showBorder ? "1px solid #D2D5EF" : "none",
                            backgroundColor: colorbg,
                            color: colortext
                        }}
                    >
                        {childrenWrapper}
                    </Paper>
                </div>
            );
        }

        // Render input components
        switch (item.type) {
            case "Note":
                componentToRender = <div className={`flex items-center flex-1`}>
                    <Textarea
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập tên..."
                        onChange={(e) => {
                            item.props.name = e.currentTarget.value;
                        }}
                        value={item.props.name}
                        maxLength={item.props.max}
                        mb="md"
                        flex={1}
                    />
                </div>
                break;
            case "Đường dẫn liên kết":
                componentToRender = <div className={'w-full'} >
                    <TextInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập tên..."
                        onChange={(e) => {
                            item.props.name = e.currentTarget.value;
                        }}
                        defaultValue={item.props.defaultValue}
                        maxLength={item.props.max}
                        mb="md"
                    />
                </div>
                break;
            case "Email":
                componentToRender = <div className={'w-full'} >
                    <TextInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập email..."
                        onChange={(e) => {
                            item.props.name = e.currentTarget.value;
                        }}
                        defaultValue={item.props.defaultValue}
                        maxLength={item.props.max}
                        type="email"
                        mb="md"
                    />
                </div>
                break;
            case "Số điện thoại":
                componentToRender = <div className={'w-full'} >
                    <TextInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập số điện thoại..."
                        onChange={(e) => {
                            item.props.name = e.currentTarget.value;
                        }}
                        defaultValue={item.props.defaultValue}
                        maxLength={item.props.max}
                        mb="md"
                    />
                </div>
                break;
            case "Biểu thức chính quy":
                componentToRender = <div className={'w-full'} >
                    <TextInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập giá trị..."
                        onChange={(e) => {
                            item.props.name = e.currentTarget.value;
                        }}
                        defaultValue={item.props.defaultValue}
                        maxLength={item.props.max}

                        mb="md"
                    />
                </div>
                break;
            case "Số":
                componentToRender = <div className={'w-full'} >
                    <NumberInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập giá trị..."
                        onChange={(e) => {
                            item.props.name = e?.toString() ?? "";
                        }}
                        defaultValue={Number(item.props.defaultValue)}
                        max={item.props.max}
                        min={item.props.min}
                        mb="md"
                    />
                </div>
                break;
            case "Phần trăm":
                componentToRender = <div className={'w-full'} >
                    <NumberInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập giá trị..."
                        onChange={(e) => {
                            item.props.name = e?.toString() ?? "";
                        }}
                        defaultValue={Number(item.props.defaultValue)}
                        max={0}
                        min={100}
                        mb="md"
                    />
                </div>
                break;
            case "Tiền tệ":
                componentToRender = <div className={'w-full'} >
                    <NumberInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập giá trị..."
                        onChange={(e) => {
                            item.props.name = e?.toString() ?? "";
                        }}
                        defaultValue={Number(item.props.defaultValue)}
                        mb="md"
                    />
                </div>
                break;
            case "Giới tính":
                componentToRender = <div className={'w-full'} >
                    <Select
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Chọn..."
                        data={[
                            { value: "1", label: "Nam" },
                            { value: "2", label: "Nữ" },
                        ]}
                        defaultValue={item.props.defaultValue}
                        onChange={(e) => {
                            item.props.name = e?.toString() ?? "";
                        }}
                    />
                </div>
                break;
            case "Danh sách lựa chọn":
                // componentToRender = <Select className='flex-1' placeholder={item.props.placeholder || item.type} data={['Tùy chọn 1', 'Tùy chọn 2']} label={item.props.label} />;
                if (item.props.type == "checkbox") {
                    componentToRender = <div className={'w-full'} >

                        <Radio.Group
                            label={
                                <span className="text-black">
                                    {item.props.label}
                                </span>}
                            withAsterisk
                        // onChange={(e) => {
                        //     item.props=e?.toString()??"";
                        // }}
                        >
                            <Group mt="xs">
                                {item.props.listSelectOption.map((option) => (
                                    <Radio key={option.value} value={option.value} label={option.name} />
                                ))}
                            </Group>
                        </Radio.Group>
                    </div>
                }

                if (item.props.type == "dropDown") {
                    componentToRender = <div className={'w-full'} >

                        <MultiSelect
                            label={
                                <span className="text-black">
                                    {item.props.label}
                                </span>
                            }
                            placeholder="Chọn..."
                            data={item.props.listSelectOption.map((option) => { return { value: option.value, label: option.name } })}
                            defaultValue={item.props.defaultValue}
                        // onChange={(e) => {
                        //     item.props.name=e?.toString()??"";
                        // }}
                        />
                    </div>
                }


                break;
            case "Trạng thái":
                // componentToRender = <Select className='flex-1' placeholder={item.props.placeholder || item.type} data={['Tùy chọn 1', 'Tùy chọn 2']} label={item.props.label} />;
                componentToRender = <div className={'w-full'} >

                    <MultiSelect
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Chọn..."
                        data={item.props.listSelectOption.map((option) => { return { value: option.value, label: option.name } })}
                        defaultValue={item.props.defaultValue}
                    // onChange={(e) => {
                    //     item.props.name=e?.toString()??"";
                    // }}
                    />
                </div>
                break;
            case "Thời gian":
                // componentToRender = <TextInput className='flex-1' placeholder={item.props.placeholder || item.type} type="time" label={item.props.label} readOnly={item.props.readOnly} />;
                if (item.props.type == "dateTime") {
                    componentToRender = <div className={'w-full'} >

                        <DateTimePicker
                            label={
                                <span className="text-black">

                                </span>
                            }
                            placeholder="Chọn..."
                            // data={item.props.listSelectOption.map((option)=>{return{value:option.value,label:option.name}})}
                            defaultValue={item.props.defaultValue}
                        // onChange={(e) => {
                        //     item.props.name=e?.toString()??"";
                        // }}
                        />
                    </div>
                }

                if (item.props.format == "date") {
                    componentToRender = <div className={'w-full'} >
                        <Text></Text>
                        <DateInput
                            label={
                                <span className="text-black">

                                </span>
                            }
                            placeholder="Chọn..."
                            // data={item.props.listSelectOption.map((option)=>{return{value:option.value,label:option.name}})}
                            defaultValue={item.props.defaultValue}
                        // onChange={(e) => {
                        //     item.props.name=e?.toString()??"";
                        // }}
                        />
                    </div>
                }
                break;
            case "Button group":
                componentToRender = <Group className="w-full" justify={item.props.align}>
                    {item.children?.map((button) => (
                        <Button key={button.id} variant={button.props.style} size={button.props.size}>{button.props.label}</Button>
                    ))}
                </Group>
                break;
            case "Văn bản dài":
                componentToRender = <div className={'w-full'} >
                    <Textarea
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập giá trị..."
                        onChange={(e) => {
                            item.props.name = e.currentTarget.value;
                        }}
                        defaultValue={item.props.defaultValue}
                        maxLength={item.props.max}
                        mb="md"
                    />
                </div>
                break
            case "Văn bản ngắn":
                componentToRender = <div className={'w-full'} >
                    <TextInput
                        label={
                            <span className="text-black">
                                {item.props.label}
                            </span>
                        }
                        placeholder="Nhập giá trị..."
                        onChange={(e) => {
                            item.props.name = e.currentTarget.value;
                        }}
                        defaultValue={item.props.defaultValue}
                        maxLength={item.props.max}
                        mb="md"
                    />
                </div>
                break
            default:
                // componentToRender = <Text className='flex-1'>{item.type} - Không hỗ trợ xem trước</Text>;
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <IconMenu2 stroke={2} className='mr-[10px]' /> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
        }

        return (
            <div>
                <Paper
                    style={{ position: 'relative', boxShadow: 'none' }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >


                    <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        gap={{ base: 'sm', sm: 'lg' }}
                        justify={{ sm: 'center' }}
                        align="center"
                    >
                        {componentToRender}
                    </Flex>
                </Paper>
            </div>
        );
    };

    return (
        <div style={{ height: '100%', overflowY: 'auto', maxHeight: '100vh' }} className="py-6">
            <Stack gap="md">
                {
                    userTaskStore.userTask.map(item => (
                        <Box key={item.id}>
                            {renderComponent(item)}
                        </Box>
                    ))
                }
            </Stack>
        </div>
    );
});


export default Process;
