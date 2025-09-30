"use client";

import {
    AppShell,
    Box,
    Flex,
    Text,
    Stack,
    Button,
    TextInput,
    Checkbox,
    Select,
    Title,
    Divider,
    Group,
    Tooltip,
    Tabs,
    Paper,
    ActionIcon,
    NumberInput,
    Radio,
    RadioIconProps,
    Textarea,
    SelectProps,
    ThemeIcon, MultiSelect, Popover,
} from '@mantine/core';
import {
    IconLink,
    IconClock,
    IconMail,
    IconPhone,
    IconFileText,
    IconShape,
    IconCheck,
    IconPlus,
    IconVector,
    IconArrowsMove,
    IconLayoutSidebarLeftCollapse,
    IconLayoutColumns,
    IconTrash, IconEdit,
    IconMenu2,
    IconExclamationCircle,
    IconCoin,
    IconPercentage,
    IconNumber123,
    IconMailOpened,
    IconCalendarStats,
    IconFileUpload,
    IconListCheck,
    IconSelect,
    IconSection,
    IconStackMiddle,
    IconTableRow,
    IconBraces,
} from '@tabler/icons-react';
import { useState, useMemo, useCallback, FC, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DateInput, DateTimePicker } from "@mantine/dates";
import { ChildFormProps, childProps, ComponentData, ComponentProps, IButtonGroup, IOptionSelect } from '@/app/types/consts';
import { useManagerBpmnContext } from '@/app/libs/contexts/manager-bpmn-context';


export const dynamic = "force-dynamic";
interface Option {
    label: string;
    value: string;
    example: string;
}

const options: Option[] = [
    { label: "Thông thường", value: "", example: "1000000" },
    { label: "# ##0", value: " ", example: "1 000 000" },
    { label: "#,##0", value: ",", example: "1,000,000" },
    { label: "#.##0", value: ".", example: "1.000.000" },
    { label: "#,##,##0 (kiểu Ấn Độ)", value: "indian", example: "1,00,00,000" },
];

interface CurrencyOption {
    value: string;
    label: string;
    code: string;
}


const data: CurrencyOption[] = [
    { value: "VND", label: "Vietnam", code: "VND" },
    { value: "USD", label: "United States", code: "USD" },
    { value: "EUR", label: "Eurozone", code: "EUR" },
    { value: "JPY", label: "Japan", code: "JPY" },
    { value: "GBP", label: "United Kingdom", code: "GBP" },
    { value: "INR", label: "India", code: "INR" },
];

// Define component data structure
// Define component data structure




// Function to check if a component can contain children
const isContainer = (type: string) => {
    return ['Layout Row', 'Layout Column', 'Tab Section', 'Tab', 'Section', 'Group'].includes(type);
};

// Component for the sidebar
const Sidebar = () => {
    const sidebarItems = [

        { label: "Note", icon: <IconFileText size={16} /> },
        { label: "Đường dẫn liên kết", icon: <IconLink size={16} /> },
        { label: "Số", icon: <IconNumber123 size={16} /> },
        { label: "CV", icon: <IconFileUpload size={16} /> },
        { label: "Phần trăm", icon: <IconPercentage size={16} /> },
        { label: "Tiền tệ", icon: <IconCoin size={16} /> },
        { label: "Thời gian", icon: <IconClock size={16} /> },
        { label: "Email", icon: <IconMail size={16} /> },
        { label: "Số điện thoại", icon: <IconPhone size={16} /> },
        { label: "Biểu thức chính quy", icon: <IconBraces size={16} /> },
        { label: "Giới tính", icon: <IconCheck size={16} /> },
        { label: "Danh sách lựa chọn", icon: <IconListCheck size={16} /> },
        { label: "Trạng thái", icon: <IconSelect size={16} /> },
    ];

    const sliderBarItemLayout = [
        // { label: "Layout Row", icon: <IconLineDashed size={16} /> },
        // { label: "Layout Column", icon: <IconColumns size={16} /> },
        { label: "Section", icon: <IconSection size={16} /> },
        { label: "Tab Section", icon: <IconTableRow size={16} /> },
        { label: "Button group", icon: <IconShape size={16} /> },
        { label: "Group", icon: <IconStackMiddle size={16} /> },
    ]

    return (
        <Box w={300} p="md" bg="gray.1" style={{
            borderRight: '1px solid var(--mantine-color-gray-3)',
            width: 300,
            height: '100%',
            overflowY: 'hidden',
            minHeight: 0
        }}>
            <Title order={3}
                style={{
                    width: '100%',
                    height: 48,
                    flex: 'none'
                }}
            >
                Thiết lập biểu mẫu
            </Title>
            <Box
                style={{
                    overflowY: 'auto',
                    width: '100%',
                    height: 'calc(100% - 48px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                }}
            >
                <h4 className="font-bold px-4 py-2 mb-2">Layout</h4>
                {sliderBarItemLayout.map((item, index) => (
                    <Paper
                        key={index}
                        withBorder
                        p="sm"
                        style={{ cursor: "grab" }}
                        draggable="true"
                        onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", item.label);
                            e.stopPropagation();
                        }}
                    >
                        <Group gap="xs">
                            {item.icon}
                            <Text>{item.label}</Text>
                        </Group>
                    </Paper>
                ))}
                <h4 className="font-bold px-4 py-2 mb-2">Field</h4>
                {sidebarItems.map((item, index) => (
                    <Paper
                        key={index}
                        withBorder
                        p="sm"
                        style={{ cursor: "grab" }}
                        draggable="true"
                        onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", item.label);
                            e.stopPropagation();
                        }}
                    >
                        <Group gap="xs">
                            {item.icon}
                            <Text>{item.label}</Text>
                        </Group>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

// Component for the main content area
const MainContent = ({ layoutTree, onDrop, onAddLayoutComponent, onSelectComponent, onDeleteComponent, selectedComponent }) => {
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    // Render each component based on its type
    const renderComponent = (item: ComponentData) => {
        const isSelected = item.id === selectedComponent?.id;
        const isDragOver = item.id === dragOverId;
        let componentToRender;

        if (isContainer(item.type)) {
            let colorbg = "blue";
            let colortext = "#ffff";
            let colorborder = "#ffff";
            let title = item.type;

            switch (item.type) {
                case "Layout Row":
                    colorbg = "#F6F7FC";
                    colortext = "#616bc9";
                    colorborder = "#D2D5EF";
                    break;
                case "Layout Column":
                    colorbg = "#edf7ee";
                    colortext = "#4caf50";
                    colorborder = "#c8e6c9";
                    break;
                case "Group":
                    colorbg = "#fdeeec";
                    colortext = "#ED5044";
                    colorborder = "#f9c9c5";
                    break;
                case "Section":
                    colorbg = "#EBEEF9";
                    colortext = "#5C79d2";
                    colorborder = "#c0cbee";
                    break;
                case "Tab Section":
                    colorbg = "#EBEEF9";
                    colortext = "#5C79d2";
                    colorborder = "#c0cbee";
                    break;
            }

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
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDrop={(e) => {
                                            onDrop(e, tab.id); // thả vào đúng panel
                                            setDragOverId(null);
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
                <Paper
                    key={item.id}
                    withBorder={showBorder}
                    style={{
                        borderColor: colorborder,
                        paddingTop: paddingTop ?? 16,
                        paddingRight: paddingRight ?? 16,
                        paddingBottom: paddingBottom ?? 16,
                        paddingLeft: paddingLeft ?? 16,
                        boxShadow: isSelected
                            ? `0 0 0 2px var(--mantine-color-blue-5)`
                            : isDragOver
                                ? `0 0 0 2px var(--mantine-color-teal-5)`
                                : "none",
                        borderStyle: isDragOver ? "dashed" : "solid",
                        backgroundColor: colorbg,
                        color: colortext
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDragEnter={(e) => {
                        e.stopPropagation();
                        setDragOverId(item.id);
                    }}
                    onDragLeave={(e) => {
                        e.stopPropagation();
                        setDragOverId(null);
                    }}
                    onDrop={(e) => {
                        onDrop(e, item.id);
                        setDragOverId(null);
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectComponent(item);
                    }}
                >
                    <Group justify="space-between" align="center" mb="xs">
                        <Group gap="xs">
                            <IconArrowsMove size={16} />
                            <Text fz="sm" c={`${colortext}.5`}>
                                {title}
                            </Text>
                        </Group>
                        <ActionIcon
                            variant="transparent"
                            color="gray"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteComponent(item.id);
                            }}
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                    {childrenWrapper}
                </Paper>
            );
        }

        // Render input components
        switch (item.type) {
            case "Note":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" className='mr-[15px]'> <IconFileText style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Đường dẫn liên kết":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" color="rgba(127, 93, 201, 1)" className='mr-[15px]'> <IconLink style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Email":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" color="rgba(148, 50, 50, 1)" className='mr-[15px]'> <IconMail style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Số điện thoại":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" color="rgba(114, 30, 170, 1)" className='mr-[15px]'> <IconPhone style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Biểu thức chính quy":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <IconMenu2 stroke={2} className='mr-[10px]' /> : <IconBraces stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Số":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" color="rgba(127, 93, 201, 1)" className='mr-[15px]'> <IconNumber123 style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Phần trăm":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" color="teal" className='mr-[15px]'> <IconPercentage style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Tiền tệ":
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" color="red" className='mr-[15px]'> <IconCoin style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Giới tính":
                // componentToRender = <Checkbox className='flex-1' label={item.props.label || item.type} readOnly={item.props.readOnly} />;
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <IconMenu2 stroke={2} className='mr-[10px]' /> : <IconCheck stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Danh sách lựa chọn":
                // componentToRender = <Select className='flex-1' placeholder={item.props.placeholder || item.type} data={['Tùy chọn 1', 'Tùy chọn 2']} label={item.props.label} />;
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <IconMenu2 stroke={2} className='mr-[10px]' /> : <IconListCheck stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Trạng thái":
                // componentToRender = <Select className='flex-1' placeholder={item.props.placeholder || item.type} data={['Tùy chọn 1', 'Tùy chọn 2']} label={item.props.label} />;
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <IconMenu2 stroke={2} className='mr-[10px]' /> : <IconSelect stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Thời gian":
                // componentToRender = <TextInput className='flex-1' placeholder={item.props.placeholder || item.type} type="time" label={item.props.label} readOnly={item.props.readOnly} />;
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <ThemeIcon variant="light" color="rgba(235, 241, 58, 1)" className='mr-[15px]'> <IconClock style={{ width: '70%', height: '70%' }} /></ThemeIcon> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
                break;
            case "Button group":
                componentToRender = <Group>
                    {item.children?.map((button) => (
                        <Button variant={button.props.style} size={button.props.size}>{button.props.label}</Button>
                    ))}
                </Group>
                break;
            default:
                // componentToRender = <Text className='flex-1'>{item.type} - Không hỗ trợ xem trước</Text>;
                componentToRender = <div className={`flex items-center flex-1`}>
                    {item.props.name ? <IconMenu2 stroke={2} className='mr-[10px]' /> : <IconExclamationCircle stroke={2} className='mr-[10px]' />}
                    {item.props.name ? <span className='!text-[#000]'>{item.props.name}</span> : item.type}
                </div>
        }

        return (
            <Paper
                withBorder
                p="md"
                mb="md"
                style={{ position: 'relative', boxShadow: isSelected ? `0 0 0 2px var(--mantine-color-blue-5)` : 'none' }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectComponent(item);
                }}
            >
                {/* <Group align="center">
                    {componentToRender}
                    <ActionIcon variant="transparent" color="gray" onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComponent(item.id);
                    }}>
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group> */}

                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'center' }}
                    align="center"
                >
                    {componentToRender}
                    <ActionIcon variant="transparent" color="gray" onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComponent(item.id);
                    }}>
                        <IconTrash size={16} />
                    </ActionIcon>
                </Flex>
            </Paper>
        );
    };

    return (
        <Box
            flex={1}
            p="xl"
            bg="gray.0"
            onDragOver={(e) => { e.preventDefault(); setDragOverId("main-content-root"); }}
            onDragLeave={(e) => { setDragOverId(null); }}
            onDrop={(e) => { onDrop(e, "main-content-root"); setDragOverId(null); }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onSelectComponent(null);
                }
            }}
            style={{ height: '100%', overflowY: 'auto', position: 'relative', border: dragOverId === "main-content-root" ? '2px dashed var(--mantine-color-teal-5)' : '2px dashed transparent' }}
        >
            <Flex justify="space-between" align="center" mb="lg">
                <Group gap="xs">
                    <Tooltip label="Đổi tên" withArrow>
                        <Text fz="lg" fw="bold">
                            Tiêu đề màn hình
                        </Text>
                    </Tooltip>
                </Group>
                <Group gap="xs">
                    {/* <Button variant="subtle">Xem trước</Button>
                    <Button>Xuất bản</Button> */}
                </Group>
            </Flex>

            <Button size="sm" leftSection={<IconVector size={16} />} onClick={() => onAddLayoutComponent('first')} className='my-[20px]'>
                Thêm Layout Row
            </Button>

            <Stack gap="md">
                {layoutTree.length > 0 ? (
                    layoutTree.map(item => (
                        <Box key={item.id}>
                            {renderComponent(item)}
                        </Box>
                    ))
                ) : (
                    <Text ta="center" fz="lg" c="gray.4" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        Kéo thả các thành phần vào đây để bắt đầu
                    </Text>
                )}
            </Stack>
            <Button size="sm" leftSection={<IconVector size={16} />} onClick={() => onAddLayoutComponent('last')} className='my-[20px]'>
                Thêm Layout Row
            </Button>
        </Box>
    );
};

// Component for the right panel
const RightPanel = ({ selectedComponent, editedComponentProps, onPropertyChange, onPropertyChangeC2, onSave, onCancel }) => {
    if (!selectedComponent) {
        return (
            <Box w={300} h={'100%'} p="md" bg="white" style={{ borderLeft: '1px solid var(--mantine-color-gray-3)' }}>
                <Text fz="lg" fw="bold" ta="center" c="gray.4" style={{ marginTop: '20vh' }}>
                    Chọn một thành phần để chỉnh sửa
                </Text>
            </Box>
        );
    }

    const t = (selectedComponent.type || '').trim();

    const renderContainerProps = () => (
        <>
            <Divider my="sm" />
            <Box>
                <Text fz="sm" fw="bold" mb="xs">ID</Text>
                <TextInput readOnly value={selectedComponent.id} />
            </Box>
            <Box>
                <Text fz="sm" fw="bold" mb="xs">Loại</Text>
                <TextInput readOnly value={selectedComponent.type} />
            </Box>

            <Divider my="sm" />
            <Text fz="sm">Thuộc tính layout</Text>

            <Box mt="xs">
                <Text fz="sm" fw="bold" mb="xs">Hiển thị Border</Text>
                <Checkbox
                    label="Hiển thị"
                    checked={!!editedComponentProps?.showBorder}
                    onChange={(e) => onPropertyChange('showBorder', e.currentTarget.checked)}
                />
            </Box>

            <Box mt="xs">
                <Text fz="sm" fw="bold" mb="xs">Hiển thị thành phần</Text>
                <Checkbox
                    label="Hiển thị"
                    checked={editedComponentProps?.visible ?? true}
                    onChange={(e) => onPropertyChange('visible', e.currentTarget.checked)}
                />
            </Box>

            <Box mt="sm">
                <Text fz="sm" fw="bold" mb="xs">Padding (px)</Text>
                <Group grow>
                    <TextInput
                        placeholder="0"
                        value={String(editedComponentProps?.paddingTop ?? '')}
                        onChange={(e) => onPropertyChange('paddingTop', e.currentTarget.value)}
                        rightSection={<Text>px</Text>}
                    />
                    <TextInput
                        placeholder="0"
                        value={String(editedComponentProps?.paddingRight ?? '')}
                        onChange={(e) => onPropertyChange('paddingRight', e.currentTarget.value)}
                        rightSection={<Text>px</Text>}
                    />
                </Group>
                <Group grow mt="xs">
                    <TextInput
                        placeholder="0"
                        value={String(editedComponentProps?.paddingBottom ?? '')}
                        onChange={(e) => onPropertyChange('paddingBottom', e.currentTarget.value)}
                        rightSection={<Text>px</Text>}
                    />
                    <TextInput
                        placeholder="0"
                        value={String(editedComponentProps?.paddingLeft ?? '')}
                        onChange={(e) => onPropertyChange('paddingLeft', e.currentTarget.value)}
                        rightSection={<Text>px</Text>}
                    />
                </Group>
            </Box>

            {t === 'Layout Row' && (
                <>
                    <Box mt="xs">
                        <Text fz="sm" fw="bold" mb="xs">Số lượng cột</Text>
                        <Select
                            data={['1', '2', '3', '4', '5']}
                            value={String(editedComponentProps?.columns ?? '1')}
                            onChange={(val) => onPropertyChange('columns', val ? Number(val) : 1)}
                            placeholder="1"
                        />
                    </Box>
                    <Box mt="xs">
                        <Text fz="sm" fw="bold" mb="xs">Khoảng cách giữa các cột (px)</Text>
                        <TextInput
                            placeholder="20"
                            value={String(editedComponentProps?.gap ?? '')}
                            onChange={(e) => {
                                const v = e.currentTarget.value;
                                // keep as number if possible
                                onPropertyChange('gap', v === '' ? '' : Number(v));
                            }}
                            rightSection={<Text>px</Text>}
                        />
                    </Box>
                </>
            )}
            {['Layout Column', 'Section'].includes(t) && (
                <>
                    <Box mt="xs">
                        <Text fz="sm" fw="bold" mb="xs">{t === 'Layout Column' ? "Khoảng cách giữa các Section (px)" : "Khoảng cách giữa các group (px)"}</Text>
                        <TextInput
                            placeholder="20"
                            value={String(editedComponentProps?.gap ?? '')}
                            onChange={(e) => {
                                const v = e.currentTarget.value;
                                // keep as number if possible
                                onPropertyChange('gap', v === '' ? '' : Number(v));
                            }}
                            rightSection={<Text>px</Text>}
                        />
                    </Box>
                </>
            )}

            {t === 'Group' && (
                <>
                    <Box mt="xs">
                        <Text fz="sm" fw="bold" mb="xs">Khoảng cách giữa các trường</Text>
                        <TextInput
                            placeholder="20"
                            value={String(editedComponentProps?.gap ?? '')}
                            onChange={(e) => {
                                const v = e.currentTarget.value;
                                // keep as number if possible
                                onPropertyChange('gap', v === '' ? '' : Number(v));
                            }}
                            rightSection={<Text>px</Text>}
                        />
                    </Box>

                    <Box>
                        <Text fz="md" fw={600} className='mb-[20px]!'>Định dạng cột</Text>
                        <Radio.Group
                            value={editedComponentProps?.columns || "1_column"}
                            onChange={(val) => onPropertyChange("columns", val)}
                        >
                            <Group>
                                <Radio.Card value="1_column">
                                    <Stack align="center" gap={4}>
                                        <Icon1Column column={editedComponentProps?.columns} />
                                        <Text size="sm">1 cột</Text>
                                    </Stack>
                                </Radio.Card>

                                <Radio.Card value="2_columns">
                                    <Stack align="center" gap={4}>
                                        <Icon2Column column={editedComponentProps?.columns} />
                                        <Text size="sm">2 cột</Text>
                                    </Stack>
                                </Radio.Card>
                            </Group>
                        </Radio.Group>
                    </Box>

                    {/* Thứ tự Tab-key */}
                    <Box>
                        <Text fz="md" fw={600} className='mb-[20px]!'>Thứ tự Tab-key</Text>
                        <Radio.Group
                            value={editedComponentProps?.tabOrder || "ltr"}
                            onChange={(val) => onPropertyChange("tabOrder", val)}
                        >
                            <Group>
                                <Radio
                                    value="left_right"
                                    label="Trái - Phải"
                                    icon={IconLeftRight}
                                    styles={{
                                        label: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                                        icon: { display: 'none' },
                                    }}
                                />
                                <Radio
                                    value="top_bottom"
                                    label="Trên - Dưới"
                                    icon={IconTopBottom}
                                    styles={{
                                        label: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                                        icon: { display: 'none' },
                                    }}
                                />
                            </Group>
                        </Radio.Group>
                    </Box>
                </>
            )}
            {t === "Tab Section" && (
                <>
                    {/* Số lượng tab */}
                    <Box mt="xs">
                        <Text fz="sm" fw="bold" mb="xs">Số lượng tab</Text>
                        <NumberInput
                            value={editedComponentProps?.tabCount ?? selectedComponent.children?.length ?? 0}
                            min={1}
                            onChange={(val) => onPropertyChange("tabCount", val)}
                        />
                    </Box>

                    {/* Hiển thị gạch dưới */}
                    <Box mt="xs">
                        <Checkbox
                            label="Hiển thị gạch dưới"
                            checked={!!editedComponentProps?.showUnderline}
                            onChange={(e) => onPropertyChange("showUnderline", e.currentTarget.checked)}
                        />
                    </Box>

                    {/* Danh sách tab */}
                    <Box mt="xs">
                        <Text fz="sm" fw="bold" mb="xs">Danh sách tab</Text>
                        <Stack gap="xs">
                            {selectedComponent.children?.map((tab, index) => (
                                <Group key={tab.id} justify="space-between">
                                    <Text
                                        size="sm"
                                        c="blue"
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                        onClick={() => {
                                            // có thể thêm hàm để chọn tab để rename
                                        }}
                                    >
                                        {tab.props?.label || `Tab ${index + 1}`}
                                    </Text>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={() => {
                                            // xoá tab
                                            const newTabs = selectedComponent.children.filter((t) => t.id !== tab.id);
                                            onPropertyChange("children", newTabs);
                                        }}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            ))}
                        </Stack>
                    </Box>
                </>
            )}

        </>
    );

    const renderTextFieldProps = () => (
        <>
            <Divider my="sm" />
            <Box mt="xs">
                <Text fz="sm" fw="bold" mb="xs">Tên trường</Text>
                <TextInput
                    placeholder="Nhập tên"
                    value={editedComponentProps?.name ?? ''}
                    onChange={(e) => onPropertyChange('name', e.currentTarget.value)}
                />
            </Box>
            <Box>
                <Text fz="sm" fw="bold" mb="xs">Số lượng ký tự cho phép nhập</Text>
                <NumberInput
                    label="Tối thiểu"
                    value={editedComponentProps?.min ?? 0}
                    min={0}
                    onChange={(val) => onPropertyChange("min", val)}
                />
                <NumberInput
                    label="Tối đa"
                    value={editedComponentProps?.max ?? 0}
                    mih={0}
                    onChange={(val) => onPropertyChange("max", val)}
                />
            </Box>
            <Box>
                <Text fz="sm" fw="bold" mb="xs">Giá trị mặc định</Text>
                <TextInput
                    placeholder="Nhập giá trị mặc định"
                    value={editedComponentProps?.defaultValue ?? ''}
                    onChange={(e) => onPropertyChange('defaultValue', e.currentTarget.value)}
                />
            </Box>
            <Checkbox
                mt="xs"
                label="Bắt buộc"
                checked={!!editedComponentProps?.required}
                onChange={(e) => onPropertyChange('required', e.currentTarget.checked)}
            />
            <Checkbox
                mt="xs"
                label="Chỉ đọc"
                checked={!!editedComponentProps?.readOnly}
                onChange={(e) => onPropertyChange('readOnly', e.currentTarget.checked)}
            />


            <Box>
                <Text fz="sm" fw="bold" mb="xs">Placeholder</Text>
                <span className='mb-[20px]'>Là dòng chữ gợi ý đặt tạm thời trong trường. Ví dụ: Nhập họ và tên</span>
                <TextInput
                    placeholder="Nhập nội dung placeholder không được quá 255 ký tự"
                    value={editedComponentProps?.placeholder ?? ''}
                    onChange={(e) => onPropertyChange('placeholder', e.currentTarget.value)}
                />
            </Box>


            <Textarea
                label="Mô tả"
                placeholder="Nhập mô tả"
                resize="vertical"
                autosize
                minRows={3}
                value={editedComponentProps?.descript ?? ''}
                onChange={(e) => onPropertyChange('descript', e.currentTarget.value)}
            />
        </>
    );

    const renderNumberFieldProps = (type: any) => {
        const [disableTP, setDisableTP] = useState(false);
        useEffect(() => {
            setDisableTP(!editedComponentProps?.allowDecimal);
        }, [editedComponentProps?.allowDecimal])
        return (
            <>
                {/* {renderTextFieldProps()} */}
                <Box mt="xs">
                    <Text fz="sm" fw="bold" mb="xs">Tên trường</Text>
                    <TextInput
                        placeholder="Nhập tên"
                        value={editedComponentProps?.name ?? ''}
                        onChange={(e) => onPropertyChange('name', e.currentTarget.value)}
                    />
                </Box>
                {t === 'Tiền tệ' && <Box>
                    <Select
                        label="Đơn vị tiền tệ khả dụng"
                        required
                        value={editedComponentProps?.prefixSuffixContent}
                        onChange={(val) =>
                            onPropertyChange('prefixSuffixContent', val)}
                        data={data}
                        searchable={false}
                        maxDropdownHeight={250}
                        renderOption={renderSelectOption}
                        styles={{
                            label: { fontWeight: 600, marginBottom: 8 },
                        }}
                    />
                </Box>}
                {t === 'Tiền tệ' && <Radio.Group
                    value={editedComponentProps?.prefixSuffix ?? ''}
                    label="Hiển thị đơn vị tiền tệ"
                    onChange={(val) => onPropertyChange("prefixSuffix", val)}
                >
                    <Group>
                        <Radio value="prefix" label="Trước số tiền" />
                        <Radio value="suffix" label="Sau số tiền" />
                    </Group>
                </Radio.Group>}
                <Box>
                    <Select
                        flex={1}
                        label="Kiểu hiển thị"
                        placeholder="Chọn loại điều kiện"
                        data={[
                            { value: "false", label: "Số nguyên (Integer)" },
                            { value: "true", label: "Số thập phân(decimal)" },
                        ]}
                        value={String(editedComponentProps?.allowDecimal)}
                        onChange={(val) => {
                            setDisableTP(val === "false");
                            onPropertyChange('allowDecimal', val === "true")
                        }}
                    />
                </Box>

                <Box>
                    <Select
                        label="Định dạng hiển thị"
                        required
                        value={editedComponentProps?.thousandSeparator}
                        onChange={(val) =>
                            onPropertyChange('thousandSeparator', val)}
                        data={options}
                        searchable={false}
                        maxDropdownHeight={250}
                        styles={{
                            label: { fontWeight: 600, marginBottom: 8 },
                        }}
                    />
                </Box>

                <Box>
                    <Text fz="sm" fw="bold" mb="xs">Số lượng ký tự tối đa</Text>
                    {/* <NumberInput
                    label="Phần nguyên"
                    value={editedComponentProps?.min ?? 0}
                    min={0}
                    onChange={(val) => onPropertyChange("min", val)}
                /> */}
                    <NumberInput
                        label="Phần thập phân"
                        value={editedComponentProps?.decimalScale ?? 0}
                        min={0}
                        disabled={disableTP}
                        onChange={(val) => onPropertyChange("decimalScale", val)}
                    />
                </Box>

                <Box>
                    <Text fz="sm" fw="bold" mb="xs">Khoảng giá trị hợp lệ cho phép nhập</Text>
                    <NumberInput
                        label="Tối thiểu"
                        value={editedComponentProps?.min ?? 0}
                        min={0}
                        onChange={(val) => onPropertyChange("min", val)}
                    />
                    <NumberInput
                        label="Tối đa"
                        value={editedComponentProps?.max ?? 0}
                        min={0}
                        onChange={(val) => onPropertyChange("max", val)}
                    />
                </Box>

                <Box mt="xs">
                    <Text fz="sm" fw="bold" mb="xs">Giá trị mặc định</Text>
                    <TextInput
                        placeholder="0"
                        value={editedComponentProps?.defaultValue ?? ''}
                        onChange={(e) => {
                            const v = e.currentTarget.value;
                            onPropertyChange('defaultValue', v === '' ? '' : Number(v));
                        }}
                    />
                </Box>

                <Checkbox
                    mt="xs"
                    label="Bắt buộc"
                    checked={!!editedComponentProps?.required}
                    onChange={(e) => onPropertyChange('required', e.currentTarget.checked)}
                />
                <Checkbox
                    mt="xs"
                    label="Chỉ đọc"
                    checked={!!editedComponentProps?.readOnly}
                    onChange={(e) => onPropertyChange('readOnly', e.currentTarget.checked)}
                />

                <Box>
                    <Text fz="sm" fw="bold" mb="xs">Placeholder</Text>
                    <span className='mb-[20px]'>Là dòng chữ gợi ý đặt tạm thời trong trường. Ví dụ: Nhập họ và tên</span>
                    <TextInput
                        placeholder="Nhập nội dung placeholder không được quá 255 ký tự"
                        value={editedComponentProps?.placeholder ?? ''}
                        onChange={(e) => onPropertyChange('placeholder', e.currentTarget.value)}
                    />
                </Box>


                <Textarea
                    label="Mô tả"
                    placeholder="Nhập mô tả"
                    resize="vertical"
                    autosize
                    minRows={3}
                    value={editedComponentProps?.descript ?? ''}
                    onChange={(e) => onPropertyChange('descript', e.currentTarget.value)}
                />
            </>
        );
    }

    const renderButtonGroupProps = () => {
        return (
            <>

                <Divider my="sm" />
                <Text fz="sm" fw="bold" mb="xs"> Thiết lập các trường trên giao diện</Text>
                <Select
                    label={'Vị trí hiển thị nút'}
                    data={['left', 'right', 'center']}
                    value={String(editedComponentProps?.align ?? 'left')}
                    onChange={(val) => onPropertyChange('align', val)}
                    placeholder="Chọn vị trí"
                />

                <Checkbox
                    label={'Kết hợp các nút vào một menu'}
                    value={String(editedComponentProps?.mergeToOneMenu ?? false)}
                    onChange={(val) => { onPropertyChange('mergeToOneMenu', val) }}
                ></Checkbox>

                <Select
                    label={'Menu'}
                    data={['bars', 'ellipsis', 'ellipsis-vertical', 'gear', 'list']}
                    value={String(editedComponentProps?.menu ?? 'bars')}
                    onChange={(val) => { onPropertyChange('menu', val) }}
                    placeholder="Chọn vị trí"
                />

                <TextInput
                    placeholder="0"
                    label={'Khoảng cách biểu tượng'}
                    value={String(editedComponentProps?.paddingIcon ?? '')}
                    onChange={(e) => onPropertyChange('paddingIcon', e.currentTarget.value)}
                    rightSection={<Text>px</Text>}
                />
                {editedComponentProps?.listButton?.map((cond: IButtonGroup, condIndex: number) => (
                    <Group key={condIndex} mt="xs" wrap="nowrap">
                        <Popover
                            width={300}
                            trapFocus={false}   // tránh treo web
                            position="left"
                            withArrow
                            shadow="md"
                            closeOnClickOutside// giữ popover mở
                            closeOnEscape={false}
                        >
                            <Popover.Target>
                                <IconEdit size={16} color="blue" />
                            </Popover.Target>

                            <Popover.Dropdown>
                                <Text fz="sm" fw="bold" mb="xs">Thiết lập nút</Text>

                                {/* Tên nút */}
                                <TextInput
                                    label="Tên nút"
                                    placeholder="Nhập tên nút"
                                    value={cond.name || ""}
                                    onChange={(event) =>
                                        onPropertyChangeC2(
                                            `listButton[${condIndex}].name`,
                                            event.currentTarget.value
                                        )
                                    }
                                    mb="xs"
                                />

                                {/* Loại nút */}
                                <Select
                                    comboboxProps={{
                                        withinPortal: true,
                                        keepMounted: true,  // ✅ tránh mount/unmount liên tục
                                        position: "bottom-start",
                                        zIndex: 9999,
                                    }}
                                    label="Loại nút"
                                    data={["Perform", "Rollback", "Cancel"]}
                                    value={cond.type || ""}
                                    onChange={(val) =>
                                        onPropertyChangeC2(`listButton[${condIndex}].type`, val)
                                    }
                                    placeholder="Chọn..."
                                    mb="xs"
                                />

                                {/* Mẫu nút */}
                                <Select
                                    comboboxProps={{
                                        withinPortal: true,
                                        keepMounted: true,
                                        position: "bottom-start",
                                        zIndex: 9999,
                                    }}
                                    label="Mẫu nút"
                                    data={["primary", "link", "default"]}
                                    value={cond.style || ""}
                                    onChange={(val) =>
                                        onPropertyChangeC2(`listButton[${condIndex}].style`, val)
                                    }
                                    placeholder="Chọn..."
                                    mb="xs"
                                />

                                {/* Kích thước */}
                                <Select
                                    comboboxProps={{
                                        withinPortal: true,
                                        keepMounted: true,
                                        position: "bottom-start",
                                        zIndex: 9999,
                                    }}
                                    label="Kích thước"
                                    data={["sm", "md", "lg"]}
                                    value={cond.size || ""}
                                    onChange={(val) =>
                                        onPropertyChangeC2(`listButton[${condIndex}].size`, val)
                                    }
                                    placeholder="Chọn..."
                                    mb="xs"
                                />
                            </Popover.Dropdown>
                        </Popover>

                        {/* Input ngoài popover */}
                        <TextInput
                            placeholder="Nhập tên nút"
                            value={cond.name || ""}
                            onChange={(e) =>
                                onPropertyChangeC2(
                                    `listButton[${condIndex}].name`,
                                    e.currentTarget.value
                                )
                            }
                        />

                        {/* Xóa  */}
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => {
                                editedComponentProps?.listButton.splice(condIndex, 1);
                                onSave()
                            }
                            }

                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                ))}


                {/* Thêm nút */}
                <Button
                    mt="md"
                    variant="light"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => {
                        editedComponentProps?.listButton.push({
                            name: `Button ${editedComponentProps?.listButton.length + 1}`,
                            id: crypto.randomUUID(),
                            style: 'default',
                            type: 'Perform',
                            size: 'sm'
                        });
                        onSave()
                    }
                    }
                >
                    Thêm nút
                </Button>

            </>
        );
    }

    const renderSelectProps = () => (
        <>
            {/*{renderTextFieldProps()}*/}
            {/*<Box mt="xs">*/}
            {/*    <Text fz="sm" fw="bold" mb="xs">Tùy chọn</Text>*/}
            {/*    <Button leftSection={<IconPlus size={16} />} variant="outline" fullWidth>Thêm tùy chọn</Button>*/}
            {/*</Box>*/}

            <Box mt="xs">
                <Text fz="sm" fw="bold" mb="xs">Tên trường</Text>
                <TextInput
                    placeholder="Nhập tên"
                    value={editedComponentProps?.name ?? ''}
                    onChange={(e) => onPropertyChange('name', e.currentTarget.value)}
                />



                <Select
                    mt={'sm'}
                    label="Kiểu dữ liệu"
                    placeholder="Chọn kiểu dữ liệu"
                    data={[
                        { value: "text", label: "Văn bản" },
                        { value: "number", label: "Số" },
                        { value: "boolean", label: "Boolean" },
                        { value: "date", label: "Ngày" },
                        { value: "dateTime", label: "Ngày và giờ" },
                    ]}
                    value={editedComponentProps?.typeSelect}
                    onChange={(val) => {
                        onPropertyChange('typeSelect', val)
                    }}
                />

                {/* <Checkbox
                    mt={'sm'}
                    label={'Cho phép chọn nhiều'}
                    value={editedComponentProps?.displayTypeDisplayType}
                    onChange={(val) => { onPropertyChange('displayTypeDisplayType', val.target.checked) }}
                ></Checkbox> */}


                {/* <Select
                    mt={'sm'}
                    label="Kiểu hiển thị"
                    placeholder="Chọn kiểu hiển thị"
                    data={[
                        { value: "dropDown", label: "Lựa chọn (một)" },
                        { value: "radio", label: "Radio" },
                    ]}
                    value={String(editedComponentProps?.typeSelect)}
                    onChange={(val) => {
                        onPropertyChange('typeSelect', val)
                    }}
                /> */}

                <Popover>
                    <Popover.Target>
                        <TextInput
                            flex={1}
                            mt={'sm'}
                            label="Kiểu hiển thị"
                            placeholder="Chọn kiểu hiển thị"
                            value={
                                [
                                    { value: "dropDown", label: "Lựa chọn (một)" },
                                    { value: "radio", label: "Radio" },
                                ].find((o) => o.value === editedComponentProps?.displayType)?.label || ""
                            }
                            // onClick={(e) => {
                            //     const target = (e?.currentTarget as HTMLElement)?.closest<HTMLElement>("[data-popover-target]");
                            //     if (target) (target as HTMLElement).click();

                            // }}
                            readOnly
                        />
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Stack gap="xs">
                            {[
                                { value: "dropDown", label: "Lựa chọn (một)" },
                                { value: "radio", label: "Radio" },
                            ].map((option) => (
                                <Button
                                    key={option.value}
                                    variant={option.value === editedComponentProps?.displayType ? "light" : "transparent"}
                                    fullWidth
                                    onClick={() =>
                                        onPropertyChange('displayType', option.value)
                                        // updateCondition(groupIndex, condIndex, "type", option.value || "")
                                    }
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </Stack>
                    </Popover.Dropdown>
                </Popover>

                {editedComponentProps?.listSelectOption?.map((cond: IOptionSelect, condIndex: number) => (
                    <Group key={condIndex} mt="xs">
                        <Popover
                            width={300}
                            trapFocus={false}   // tránh treo web
                            position="left"
                            withArrow
                            shadow="md"
                            closeOnClickOutside // giữ popover mở
                            closeOnEscape={false}
                        >
                            <Popover.Target>
                                <IconEdit size={16} color="blue" />
                            </Popover.Target>

                            <Popover.Dropdown>
                                <Text fz="sm" fw="bold" mb="xs">Thiết giá trị lựa chọn</Text>

                                {/* Tên option */}
                                <TextInput
                                    label="Nhãn hiển thị"
                                    placeholder="Nhập nhãn hiển thị"
                                    value={cond.name || ""}
                                    onChange={(event) =>
                                        onPropertyChangeC2(
                                            `listSelectOption[${condIndex}].name`,
                                            event.currentTarget.value
                                        )
                                    }
                                    mb="xs"
                                />

                                {/* Tên option */}
                                {editedComponentProps?.typeSelect == "text" &&
                                    <TextInput
                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || ""}
                                        onChange={(event) => 
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event.currentTarget.value
                                            )
                                        }
                                        mb="xs"
                                    />
                                }
                                {editedComponentProps?.typeSelect == "boolean" &&
                                    <Select
                                        mt={'sm'}
                                        label="Giá trị"
                                        placeholder="Chọn giá trị"
                                        data={[
                                            { value: "true", label: "Checked" },
                                            { value: "false", label: "Unchecked" },
                                        ]}
                                        value={cond.value || "checked"}
                                        onChange={(event) =>
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }

                                {editedComponentProps?.typeSelect == "number" &&
                                    <NumberInput
                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || 0}
                                        onChange={(event) => 
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }


                                {editedComponentProps?.typeSelect == "date" &&
                                    <DateInput
                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || new Date()}
                                        onChange={(event) => 
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }
                                {editedComponentProps?.typeSelect == "dateTime" &&
                                    <DateTimePicker

                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || new Date()}
                                        onChange={(event) =>
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }

                                <Checkbox
                                    mt={'sm'}
                                    label={'Giá trị mặc định'}
                                    checked={cond?.isDefault || false}
                                    onChange={(e) => {
                                        editedComponentProps?.listSelectOption?.map((cond: IOptionSelect, condIndex: number) => { return { ...cond, isDefault: false } })

                                        onPropertyChangeC2(
                                            `listSelectOption[${condIndex}].isDefault`,
                                            e.target.checked
                                        )
                                        onSave()
                                    }
                                    }
                                ></Checkbox>
                            </Popover.Dropdown>
                        </Popover>

                        {/* Input ngoài popover */}
                        <TextInput
                            placeholder="Nhập tên nút"
                            value={cond.name || ""}
                            onChange={(e) => 
                                onPropertyChangeC2(
                                    `listSelectOption[${condIndex}].name`,
                                    e.currentTarget.value
                                )}

                        />


                    </Group>
                ))}


                {/* Thêm lựa chọn */}
                <Button
                    mt="md"
                    variant="light"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => {
                        editedComponentProps?.listSelectOption.push({
                            name: `Option ${editedComponentProps?.listSelectOption.length + 1}`,
                            id: crypto.randomUUID(),
                            isDefault: false,
                            style: '',
                        });
                        onSave()
                    }
                    }
                >
                    Thêm lựa chọn
                </Button>



                <Checkbox
                    mt={'sm'}
                    label={'Sử dụng tài nguyên hoặc biến'}
                    value={editedComponentProps?.usingResourceOrVariable}
                    onChange={(val) => 
                        onPropertyChange('usingResourceOrVariable', val.target.checked)
                    }
                ></Checkbox>

                <Checkbox
                    mt="xs"
                    label="Bắt buộc"
                    checked={!!editedComponentProps?.required}
                    onChange={(e) => 
                        onPropertyChange('required', e.currentTarget.checked)}
                />

                <Checkbox
                    mt="xs"
                    label="Chỉ đọc"
                    checked={!!editedComponentProps?.readOnly}
                    onChange={(e) => 
                        onPropertyChange('readOnly', e.currentTarget.checked)}
                />
                {editedComponentProps?.readOnly &&
                    <Checkbox
                        mt="xs"
                        label="Gửi dữ liệu"
                        checked={!!editedComponentProps?.submitData}
                        onChange={(e) => 
                            onPropertyChange('submitData', e.currentTarget.checked)}
                    />
                }
            </Box>

        </>
    );


    const renderMuiltiSelectProps = () => (
        <>

            <Box mt="xs">
                <Text fz="sm" fw="bold" mb="xs">Tên trường</Text>
                <TextInput
                    placeholder="Nhập tên"
                    value={editedComponentProps?.name ?? ''}
                    onChange={(e) => 
                        onPropertyChange('name', e.currentTarget.value)
                    }
                />



                <Select
                    mt={'sm'}
                    label="Kiểu dữ liệu"
                    placeholder="Chọn kiểu dữ liệu"
                    data={[
                        { value: "text", label: "Văn bản" },
                        { value: "number", label: "Số" },
                        { value: "boolean", label: "Boolean" },
                        { value: "date", label: "Ngày" },
                        { value: "dateTime", label: "Ngày và giờ" },
                    ]}
                    value={editedComponentProps?.typeSelect}
                    onChange={(val) => 
                        onPropertyChange('typeSelect', val)
                    }
                />

                {/* <Checkbox
                    mt={'sm'}
                    label={'Cho phép chọn nhiều'}
                    value={editedComponentProps?.displayTypeDisplayType}
                    onChange={(val) => { onPropertyChange('displayTypeDisplayType', val.target.checked) }}
                ></Checkbox> */}

                {/* <Select
                    mt={'sm'}
                    label="Kiểu hiển thị"
                    placeholder="Chọn kiểu hiển thị"
                    data={ }
                    value={String(editedComponentProps?.typeSelect)}
                    onChange={(val) => {
                        onPropertyChange('typeSelect', val)
                    }}
                /> */}

                <Popover>
                    <Popover.Target>
                        <TextInput
                            flex={1}
                            mt={'sm'}
                            label="Kiểu hiển thị"
                            placeholder="Chọn kiểu hiển thị"
                            value={
                                [
                                    { value: "dropDown", label: "Lựa chọn (nhiều)" },
                                    { value: "checkbox", label: "Checkbox" },
                                ].find((o) => o.value === editedComponentProps?.displayType)?.label || ""
                            }
                            // onClick={(e) => {
                            //     const target = (e?.currentTarget as HTMLElement)?.closest<HTMLElement>("[data-popover-target]");
                            //     if (target) (target as HTMLElement).click();

                            // }}
                            readOnly
                        />
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Stack gap="xs">
                            {[
                                { value: "dropDown", label: "Lựa chọn (nhiều)" },
                                { value: "checkbox", label: "Checkbox" },
                            ].map((option) => (
                                <Button
                                    key={option.value}
                                    variant={option.value === editedComponentProps?.displayType ? "light" : "transparent"}
                                    fullWidth
                                    onClick={() => 
                                        onPropertyChange('displayType', option.value)
                                        // updateCondition(groupIndex, condIndex, "type", option.value || "")
                                    }
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </Stack>
                    </Popover.Dropdown>
                </Popover>


                {editedComponentProps?.listSelectOption?.map((cond: IOptionSelect, condIndex: number) => (
                    <Group key={condIndex} mt="xs">
                        <Popover
                            width={300}
                            trapFocus={false}   // tránh treo web
                            position="left"
                            withArrow
                            shadow="md"
                            closeOnClickOutside // giữ popover mở
                            closeOnEscape={false}
                        >
                            <Popover.Target>
                                <IconEdit size={16} color="blue" />
                            </Popover.Target>

                            <Popover.Dropdown>
                                <Text fz="sm" fw="bold" mb="xs">Thiết giá trị lựa chọn</Text>

                                {/* Tên option */}
                                <TextInput
                                    label="Nhãn hiển thị"
                                    placeholder="Nhập nhãn hiển thị"
                                    value={cond.name || ""}
                                    onChange={(event) => 
                                        onPropertyChangeC2(
                                            `listSelectOption[${condIndex}].name`,
                                            event.currentTarget.value
                                        )
                                    }
                                    mb="xs"
                                />

                                {/* Tên option */}
                                {editedComponentProps?.typeSelect == "text" &&
                                    <TextInput
                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || ""}
                                        onChange={(event) => 
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event.currentTarget.value
                                            )
                                        }
                                        mb="xs"
                                    />
                                }
                                {editedComponentProps?.typeSelect == "boolean" &&
                                    <Select
                                        mt={'sm'}
                                        label="Giá trị"
                                        placeholder="Chọn giá trị"
                                        data={[
                                            { value: "true", label: "Checked" },
                                            { value: "false", label: "Unchecked" },
                                        ]}
                                        value={cond.value || "checked"}
                                        onChange={(event) => 
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }

                                {editedComponentProps?.typeSelect == "number" &&
                                    <NumberInput
                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || 0}
                                        onChange={(event) =>
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }


                                {editedComponentProps?.typeSelect == "date" &&
                                    <DateInput
                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || new Date()}
                                        onChange={(event) =>
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }
                                {editedComponentProps?.typeSelect == "dateTime" &&
                                    <DateTimePicker

                                        label="Giá trị"
                                        placeholder="Nhập giá trị"
                                        value={cond.value || new Date()}
                                        onChange={(event) =>
                                            onPropertyChangeC2(
                                                `listSelectOption[${condIndex}].value`,
                                                event
                                            )
                                        }
                                        mb="xs"
                                    />
                                }

                                <Checkbox
                                    mt={'sm'}
                                    label={'Giá trị mặc định'}
                                    checked={cond?.isDefault || false}
                                    onChange={(e) => {
                                        editedComponentProps?.listSelectOption?.map((cond: IOptionSelect, condIndex: number) => { return { ...cond, isDefault: false } })

                                        onPropertyChangeC2(
                                            `listSelectOption[${condIndex}].isDefault`,
                                            e.target.checked
                                        )
                                    }
                                    }
                                ></Checkbox>
                            </Popover.Dropdown>
                        </Popover>

                        {/* Input ngoài popover */}
                        <TextInput
                            placeholder="Nhập tên nút"
                            value={cond.name || ""}
                            onChange={(e) =>
                                onPropertyChangeC2(
                                    `listSelectOption[${condIndex}].name`,
                                    e.currentTarget.value
                                )
                            }

                        />


                    </Group>
                ))}


                {/* Thêm lựa chọn */}
                <Button
                    mt="md"
                    variant="light"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => {
                        editedComponentProps?.listSelectOption.push({
                            name: `Option ${editedComponentProps?.listSelectOption.length + 1}`,
                            id: crypto.randomUUID(),
                            isDefault: false,
                            style: '',
                        });
                        onSave()
                    }
                    }
                >
                    Thêm lựa chọn
                </Button>



                <Checkbox
                    mt={'sm'}
                    label={'Sử dụng tài nguyên hoặc biến'}
                    value={editedComponentProps?.usingResourceOrVariable}
                    onChange={(val) => { onPropertyChange('usingResourceOrVariable', val.target.checked) }}
                ></Checkbox>

                <Checkbox
                    mt="xs"
                    label="Bắt buộc"
                    checked={!!editedComponentProps?.required}
                    onChange={(e) => onPropertyChange('required', e.currentTarget.checked)}
                />

                <Checkbox
                    mt="xs"
                    label="Chỉ đọc"
                    checked={!!editedComponentProps?.readOnly}
                    onChange={(e) => onPropertyChange('readOnly', e.currentTarget.checked)}
                />
                {editedComponentProps?.readOnly &&
                    <Checkbox
                        mt="xs"
                        label="Gửi dữ liệu"
                        checked={!!editedComponentProps?.submitData}
                        onChange={(e) => onPropertyChange('submitData', e.currentTarget.checked)}
                    />
                }
            </Box>

        </>
    );

    const renderProperties = () => {
        if (isContainer(t)) return renderContainerProps();

        switch (t) {
            case 'Note':
            case 'Đường dẫn liên kết':
            case 'Email':
            case 'Số điện thoại':
                return renderTextFieldProps();
            case 'Biểu thức chính quy':
                return <>
                    <Divider my="sm" />
                    <Box>
                        <TextInput
                            label={'Tên biểu thức'}
                            placeholder="Nhập tên biểu thức"
                            value={editedComponentProps?.name ?? ''}
                            onChange={(e) => onPropertyChange('name', e.currentTarget.value)}
                            mb={'sm'}
                        />

                        <TextInput
                            label={'Công thức'}
                            required
                            placeholder="Công thức"
                            value={editedComponentProps?.regex ?? ''}
                            onChange={(e) => onPropertyChange('regex', e.currentTarget.value)}
                            mb={'sm'}
                        />

                        <TextInput
                            label={'Kiểm tra biểu thức'}
                            required
                            placeholder="Kiểm tra biểu thức"
                            value={editedComponentProps?.check ?? ''}
                            onChange={(e) => onPropertyChange('check', e.currentTarget.value)}
                            mb={'sm'}
                        />

                        <TextInput
                            label={'Giá trị mặc định'}
                            placeholder="Nhập giá trị mặc định"
                            value={editedComponentProps?.defaultValue ?? ''}
                            onChange={(e) => onPropertyChange('defaultValue', e.currentTarget.value)}
                            mb={'sm'}
                        />

                        <Checkbox
                            mt="xs"
                            label="Bắt buộc"
                            checked={!!editedComponentProps?.required}
                            onChange={(e) => onPropertyChange('required', e.currentTarget.checked)}
                        />

                        <Checkbox
                            mt="xs"
                            label="Chỉ đọc"
                            checked={!!editedComponentProps?.readOnly}
                            onChange={(e) => onPropertyChange('readOnly', e.currentTarget.checked)}
                        />
                        {editedComponentProps?.readOnly &&
                            <Checkbox
                                mt="xs"
                                label="Gửi dữ liệu"
                                checked={!!editedComponentProps?.submitData}
                                onChange={(e) => onPropertyChange('submitData', e.currentTarget.checked)}
                            />
                        }

                        <Checkbox
                            mt="xs"
                            label="Cho phép nhập nhiều giá trị"
                            checked={!!editedComponentProps?.multiple}
                            onChange={(e) => onPropertyChange('multiple', e.currentTarget.checked)}
                        />
                        {editedComponentProps?.multiple === true &&
                            <>
                                <NumberInput
                                    label={'Nhỏ nhất'}
                                    value={editedComponentProps?.minimum ?? 0}
                                    onChange={(e) => onPropertyChange('minimum', e)}
                                    mb={'sm'}
                                />
                                <NumberInput
                                    label={'Lớn nhất'}
                                    value={editedComponentProps?.maximum ?? 0}
                                    onChange={(e) => onPropertyChange('maximum', e)}
                                    mb={'sm'}
                                />
                            </>

                        }
                        <Box>
                            <Text fz="sm" fw="bold" mb="xs">Placeholder</Text>
                            <span className='mb-[20px]'>Là dòng chữ gợi ý đặt tạm thời trong trường. Ví dụ: Nhập họ và tên</span>
                            <TextInput
                                placeholder="Nhập nội dung placeholder không được quá 255 ký tự"
                                value={editedComponentProps?.placeholder ?? ''}
                                onChange={(e) => onPropertyChange('placeholder', e.currentTarget.value)}
                            />
                        </Box>




                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập mô tả"
                            resize="vertical"
                            autosize
                            minRows={3}
                            value={editedComponentProps?.descript ?? ''}
                            onChange={(e) => onPropertyChange('descript', e.currentTarget.value)}
                        />

                    </Box>
                </>
            case 'Số':
            case 'Phần trăm':
            case 'Tiền tệ':
                return renderNumberFieldProps(t);
            case 'CV':
                return <>
                    <Box>

                        <Divider my="sm" />
                        <TextInput
                            label={'Tên'}
                            placeholder="Nhập tên"
                            value={editedComponentProps?.name ?? ''}
                            onChange={(e) => onPropertyChange('name', e.currentTarget.value)}
                            mb={'sm'}
                        />


                        <Select
                            label={'Kiểu tài liệu'}
                            required
                            data={['File', 'Media', 'File and media']}
                            value={editedComponentProps?.type}
                            onChange={(val) => {
                                onPropertyChange('type', val)
                                switch (val) {
                                    case 'File':
                                        onPropertyChange('supported', ['doc', 'docx', 'xlxs', 'xls'])
                                        break;
                                    case 'Media':
                                        onPropertyChange('supported', ['jpg', 'jpeg', 'png', 'gif'])
                                        break;
                                    case 'File and media':
                                        onPropertyChange('supported', ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'xlxs', 'xls'])
                                        break;
                                }

                            }
                            }
                            mb={'sm'}
                        />
                        {editedComponentProps?.type === 'File' &&
                            <MultiSelect

                                label={'Định dạng hỗ trợ'}
                                required
                                data={['doc', 'docx', 'xlxs', 'xls']}
                                value={editedComponentProps?.supported ?? ['doc', 'docx', 'xlxs', 'xls']}
                                onChange={(val) => onPropertyChange('supported', val)}
                                mb={'sm'}
                            />
                        }

                        {editedComponentProps?.type === 'Media' &&
                            <MultiSelect

                                label={'Định dạng hỗ trợ'}
                                required
                                data={['jpg', 'jpeg', 'png', 'gif']}
                                value={editedComponentProps?.supported ?? ['jpg', 'jpeg', 'png', 'gif']}
                                onChange={(val) => onPropertyChange('supported', val)}
                                mb={'sm'}
                            />
                        }
                        {editedComponentProps?.type === 'File and media' &&
                            <MultiSelect
                                label={'Định dạng hỗ trợ'}
                                required
                                data={['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'xlxs', 'xls']}
                                value={editedComponentProps?.supported ?? ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'xlxs', 'xls']}
                                onChange={(val) => onPropertyChange('supported', val)}
                                mb={'sm'}
                            />
                        }
                        <NumberInput
                            label={'Kích thước tài liệu tối đa (MB)'}
                            value={editedComponentProps?.maximumMB ?? 0}
                            onChange={(e) => onPropertyChange('maximumMB', e)}
                            mb={'sm'}
                        />
                        <Checkbox
                            mt="xs"
                            label="Công khai"
                            checked={!!editedComponentProps?.public}
                            onChange={(e) => onPropertyChange('public', e.currentTarget.checked)}
                        />
                        <Checkbox
                            mt="xs"
                            label="Tối ưu hóa hình ảnh"
                            checked={!!editedComponentProps?.optimizeImage}
                            onChange={(e) => onPropertyChange('optimizeImage', e.currentTarget.checked)}
                        />
                        <Checkbox
                            mt="xs"
                            label="Bắt buộc"
                            checked={!!editedComponentProps?.required}
                            onChange={(e) => onPropertyChange('required', e.currentTarget.checked)}
                        />

                        <Checkbox
                            mt="xs"
                            label="Chỉ đọc"
                            checked={!!editedComponentProps?.readOnly}
                            onChange={(e) => onPropertyChange('readOnly', e.currentTarget.checked)}
                        />
                        {editedComponentProps?.readOnly &&
                            <Checkbox
                                mt="xs"
                                label="Gửi dữ liệu"
                                checked={!!editedComponentProps?.submitData}
                                onChange={(e) => onPropertyChange('submitData', e.currentTarget.checked)}
                            />
                        }

                        <Checkbox
                            mt="xs"
                            label="Cho phép nhập nhiều giá trị"
                            checked={!!editedComponentProps?.multiple}
                            onChange={(e) => onPropertyChange('multiple', e.currentTarget.checked)}
                        />
                        {editedComponentProps?.multiple === true &&
                            <>
                                <NumberInput
                                    label={'Nhỏ nhất'}
                                    value={editedComponentProps?.minimum ?? 0}
                                    onChange={(e) => onPropertyChange('minimum', e)}
                                    mb={'sm'}
                                />
                                <NumberInput
                                    label={'Lớn nhất'}
                                    value={editedComponentProps?.maximum ?? 0}
                                    onChange={(e) => onPropertyChange('maximum', e)}
                                    mb={'sm'}
                                />
                            </>

                        }

                    </Box>
                </>

            case 'Giới tính':
                return (
                    <>
                        <Divider my="sm" />
                        <Box>
                            <Text fz="sm" fw="bold" mb="xs">Tiêu đề</Text>
                            <TextInput
                                placeholder="Nhập tiêu đề"
                                value={editedComponentProps?.label ?? ''}
                                onChange={(e) => onPropertyChange('label', e.currentTarget.value)}
                            />
                        </Box>
                        <Checkbox
                            mt="xs"
                            label="Bắt buộc"
                            checked={!!editedComponentProps?.required}
                            onChange={(e) => onPropertyChange('required', e.currentTarget.checked)}
                        />
                        <Checkbox
                            mt="xs"
                            label="Chỉ đọc"
                            checked={!!editedComponentProps?.readOnly}
                            onChange={(e) => onPropertyChange('readOnly', e.currentTarget.checked)}
                        />
                        <Checkbox
                            mt="xs"
                            label="Giá trị mặc định"
                            checked={!!editedComponentProps?.defaultValue}
                            onChange={(e) => onPropertyChange('defaultValue', e.currentTarget.checked)}
                        />
                    </>
                );
            case 'Button group':
                return renderButtonGroupProps()

            case 'Trạng thái':
                return renderSelectProps();
            case 'Danh sách lựa chọn':
                return renderMuiltiSelectProps();
            case 'Thời gian':
                return (
                    <>
                        <Divider my="sm" />
                        <Box>
                            <Text fz="sm" fw="bold" mb="xs">Tên trường</Text>
                            <TextInput
                                placeholder="Nhập tên trường"
                                value={editedComponentProps?.name ?? ''}
                                onChange={(e) => onPropertyChange('name', e.currentTarget.value)}
                            />
                        </Box>
                        <Box>
                            <Select
                                flex={1}
                                label="Kiểu hiển thị"
                                placeholder="Chọn loại điều kiện"
                                data={[
                                    { value: "date", label: "Ngày" },
                                    { value: "dateTime", label: "Ngày và giờ" },
                                ]}
                                value={String(editedComponentProps?.typeDateOrTime)}
                                onChange={(val) => {
                                    onPropertyChange('typeDateOrTime', val)
                                }}
                            />
                        </Box>
                        <Box>
                            <Select
                                flex={1}
                                label="Định dạng hiển thị"
                                placeholder="Chọn loại định dạng"
                                data={[
                                    { value: "date", label: "Ngày" },
                                    { value: "dateTime", label: "Ngày và giờ" },
                                ]}
                                value={String(editedComponentProps?.format)}
                                onChange={(val) => {
                                    onPropertyChange('format', val)
                                }}
                            />
                        </Box>
                        <Box mt="xs">
                            <Text fz="sm" fw="bold" mb="xs">Giá trị mặc định</Text>
                            <TextInput
                                type="time"
                                value={editedComponentProps?.defaultValue ?? ''}
                                onChange={(e) => onPropertyChange('defaultValue', e.currentTarget.value)}
                            />
                        </Box>
                        <Checkbox
                            mt="xs"
                            label="Bắt buộc"
                            checked={!!editedComponentProps?.required}
                            onChange={(e) => onPropertyChange('required', e.currentTarget.checked)}
                        />
                        <Checkbox
                            mt="xs"
                            label="Chỉ đọc"
                            checked={!!editedComponentProps?.readOnly}
                            onChange={(e) => onPropertyChange('readOnly', e.currentTarget.checked)}
                        />
                        {/* <Box>
                            <Text fz="sm" fw="bold" mb="xs">Placeholder</Text>
                            <span className='mb-[20px]'>Là dòng chữ gợi ý đặt tạm thời trong trường. Ví dụ: Nhập họ và tên</span>
                            <TextInput
                                placeholder="Nhập nội dung placeholder không được quá 255 ký tự"
                                value={editedComponentProps?.placeholder ?? ''}
                                onChange={(e) => onPropertyChange('placeholder', e.currentTarget.value)}
                            />
                        </Box> */}


                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập mô tả"
                            resize="vertical"
                            autosize
                            minRows={3}
                            value={editedComponentProps?.descript ?? ''}
                            onChange={(e) => onPropertyChange('descript', e.currentTarget.value)}
                        />
                    </>
                );

            default:
                return <Text ta="center" mt="md">Chưa có thuộc tính cho loại component này.</Text>;
        }
    };

    return (
        <Box w={300} h={'100%'} p="md" bg="white" style={{
            borderLeft: '1px solid var(--mantine-color-gray-3)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
        }}>
            <Flex justify="space-between" align="center" mb="md">
                <Title order={4}>Thuộc tính</Title>
            </Flex>

            <Flex justify="space-between" align="center" mb="md">
                <Button variant="light" size="xs" onClick={onSave}>
                    Thiết lập thuộc tính trạng
                </Button>
            </Flex>

            <Stack>
                {renderProperties()}
            </Stack>

            {/* <Group justify="flex-end" mt="xl">
                <Button variant="subtle" onClick={onCancel}>Hủy</Button>
                <Button variant="outline">Xem trước</Button>
                <Button onClick={onSave}>Hoàn thành</Button>
            </Group> */}
        </Box>
    );
};

// Recursive function to find and update a component in the layout tree
const findAndUpdateComponent = (
    tree: ComponentData[],
    id: string,
    newProps?: Partial<ComponentProps>,
    newChildren?: ComponentData[]
): ComponentData[] => {
    return tree.map(node => {
        if (node.id === id) {
            return {
                ...node,
                props: newProps ? { ...node.props, ...newProps } : node.props,
                children: newChildren !== undefined ? newChildren : node.children,
            };
        }

        if (node.children) {
            const updatedChildren = findAndUpdateComponent(node.children, id, newProps, newChildren);
            if (updatedChildren !== node.children) {
                return { ...node, children: updatedChildren };
            }
        }

        return node;
    });
};

const findComponentById = (tree: ComponentData[], id: string): ComponentData | undefined => {
    for (const node of tree) {
        if (node.id === id) {
            return node;
        }
        if (node.children) {
            const found = findComponentById(node.children, id);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
};

const HomeFormBM = forwardRef<childProps, ChildFormProps>(({ dataChildren, onSubmit }, ref) => {
    const { data, setData, dataField, setDataField } = useManagerBpmnContext();
    const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
    const [editedComponentProps, setEditedComponentProps] = useState<ComponentProps | null>(null);
    const createComponent = useCallback((type: string, children?: ComponentData[]): ComponentData => {
        let props: ComponentProps = {};
        if (type === 'Note' || type === 'Giới tính' || type === 'Danh sách lựa chọn' || type === 'Thời gian' || type === 'Đường dẫn liên kết' || type === 'Email' || type === 'Số điện thoại' || type === 'Biểu thức chính quy' || type === 'Trạng thái') {

            let maxDefau = 0;
            switch (type) {
                case "Đường dẫn liên kết":
                    maxDefau = 2048;
                    break;
                case "Note":
                    maxDefau = 131072;
                    break;
                case "Email":
                    maxDefau = 255;
                    break;
                default:
                    maxDefau = 0;
                    break
            }
            props = {
                label: type,
                placeholder: `Nhập ${type}`,
                required: false,
                readOnly: false,
                min: 0,
                max: maxDefau,
                descript: "",
                listSelectOption: [],
            };
        } else if (type === 'Số' || type === "Phần trăm" || type === "Tiền tệ") {
            let maxDefau = 0;
            props = {
                label: type,
                placeholder: `Nhập ${type}`,
                required: false,
                readOnly: false,
                min: 0,
                max: maxDefau,
                descript: "",
            };
            switch (type) {
                case "Số":
                case "Phần trăm":
                    props.allowDecimal = false;
                    props.thousandSeparator = "";
                    break;
                default:
                    props.allowDecimal = true;
                    break;
            }
        } else if (type === 'Button group') {
            props = {
                listButton: []
            }
        } else {
            if (type === 'Group') {
                props = {
                    showBorder: true,
                    paddingBottom: 16,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 16,
                    columns: "2_columns",
                }
            } else {
                props = {
                    showBorder: true
                }
                if (type === 'Tab Section') {
                    children = [...children,
                    {
                        id: crypto.randomUUID(),
                        type: "Tab",
                        props: { label: "Tab 1", showBorder: false },
                        children: [{
                            id: `Group-${crypto.randomUUID()}`,
                            type: "Group",
                            children: isContainer(type) ? (children || []) : undefined,
                            props,
                        }],
                    },
                    {
                        id: crypto.randomUUID(),
                        type: "Tab",
                        props: { label: "Tab 2", showBorder: false },
                        children: [{
                            id: `Group-${crypto.randomUUID()}`,
                            type: "Group",
                            children: isContainer(type) ? (children || []) : undefined,
                            props,
                        }],
                    },
                    ];
                }
            }

        }
        return {
            id: crypto.randomUUID(),
            type,
            children: isContainer(type) ? (children || []) : undefined,
            props,
        };
    }, []);

    const getTypeProp = (type: string) => {
        switch (type) {
            case "Note":
                return "text";
            case "Đường dẫn liên kết":
                return "link";
            case 'Giới tính':
                return "boolean";
            case 'Số':
            case "Phần trăm":
            case "Tiền tệ":
                return "number"
            case "Số điện thoại":
                return "phone"
            case "Email":
                return "email";
            case "Biểu thức chính quy":
                return "regex";
            case "Trạng thái":
                return "single_choice"
            case "Danh sách lựa chọn":
                return "multiple_choice";
            default:
                return "file";
        }
    }

    const initialNestedLayout: ComponentData[] = useMemo(() => [

        createComponent('Layout Row', [
            createComponent('Layout Column', [
                createComponent('Section', [
                    createComponent('Group', [])
                ])
            ])
        ],)
    ], [createComponent]);

    const [layoutTree, setLayoutTree] = useState<ComponentData[]>(initialNestedLayout);
    useEffect(() => {
        if (dataChildren.length > 0) {
            setLayoutTree(dataChildren);
        } else {
            setLayoutTree(initialNestedLayout);
        }
    }, [dataChildren])

    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            onSubmit(layoutTree);
        },
    }));
    const findAndAddChild = useCallback((tree: ComponentData[], parentId: string, newItem: ComponentData): ComponentData[] => {
        return tree.map(node => {
            if (node.id === parentId) {
                return {
                    ...node,
                    children: [...(node.children || []), newItem]
                };
            }
            if (node.children) {
                const updatedChildren = findAndAddChild(node.children, parentId, newItem);
                if (updatedChildren !== node.children) {
                    return {
                        ...node,
                        children: updatedChildren
                    };
                }
            }
            return node;
        });
    }, []);

    const findAndRemove = useCallback((tree: ComponentData[], itemId: string): ComponentData[] => {
        return tree.filter(node => node.id !== itemId).map(node => {
            if (node.children) {
                return {
                    ...node,
                    children: findAndRemove(node.children, itemId)
                };
            }
            return node;
        });
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, parentId: string) => {
        e.preventDefault();
        e.stopPropagation();
        const itemType = e.dataTransfer.getData("text/plain");

        const newItem: ComponentData = createComponent(itemType, isContainer(itemType) ? [] : undefined);

        if (parentId === "main-content-root") {
            setLayoutTree(currentTree => [newItem, ...currentTree]);
        } else {
            setLayoutTree(currentTree => findAndAddChild(currentTree, parentId, newItem));
        }
        setSelectedComponent(newItem);
        setEditedComponentProps(newItem.props);
        const typeProp = getTypeProp(newItem.type);
        const objectDataFiels = { ...newItem.props, type: typeProp, id: newItem.id };
        setDataField([...dataField, objectDataFiels]);

    }, [findAndAddChild, setLayoutTree, createComponent]);

    const handleDelete = useCallback((itemId: string) => {
        setLayoutTree(currentTree => findAndRemove(currentTree, itemId));
        setSelectedComponent(null);
        setEditedComponentProps(null);
    }, [findAndRemove, setLayoutTree]);

    const handleAddLayoutComponent = useCallback((index: string) => {
        let newComponent: ComponentData;

        newComponent = createComponent('Layout Row', [
            createComponent('Layout Column', [
                createComponent('Section', [
                    createComponent('Group')
                ])
            ])
        ]);
        if (index === 'first') {
            setLayoutTree(currentTree => [newComponent, ...currentTree]);
        } else {
            setLayoutTree(currentTree => [...currentTree, newComponent]);
        }
        setSelectedComponent(newComponent);
        setEditedComponentProps(newComponent.props);
    }, [setLayoutTree, createComponent]);

    const handleSelectComponent = useCallback((component: ComponentData | null) => {
        setSelectedComponent(component);
        if (component) {
            setEditedComponentProps(component.props);
        } else {
            setEditedComponentProps(null);
        }
    }, []);

    //list []
    const handlePropertyChangeList = useCallback((path: string, value: any) => {
        setEditedComponentProps((prev) => (prev ? setDeep(prev, path, value) : prev));
    }, []);

    //thằng c1
    const handlePropertyChange = useCallback((propName: keyof ComponentProps, value: any) => {
        setEditedComponentProps(prevProps => prevProps ? { ...prevProps, [propName]: value } : null);
    }, []);

    const handleSave = useCallback(() => {
        if (selectedComponent && editedComponentProps) {
            let updatedProps = { ...editedComponentProps };
            let updatedChildren = [...(selectedComponent.children || [])];

            if (selectedComponent.type === "Tab Section") {
                const currentCount = updatedChildren.length;
                const newCount = editedComponentProps.tabCount ?? currentCount;

                if (newCount > currentCount) {
                    // Thêm tab mới
                    const tabsToAdd = newCount - currentCount;
                    for (let i = 0; i < tabsToAdd; i++) {
                        updatedChildren.push({
                            id: crypto.randomUUID(),
                            type: "Tab",
                            props: { label: `Tab ${currentCount + 1 + i}`, showBorder: false },
                            children: [{
                                id: crypto.randomUUID(),
                                type: "Group",
                                children: [],
                                props: {
                                    showBorder: true
                                },
                            }],
                        },);
                    }
                } else if (newCount < currentCount) {
                    // Cắt bớt tab
                    updatedChildren = updatedChildren.slice(0, newCount);
                }
            }

            if (selectedComponent.type === "Button group") {
                const newButton = updatedProps.listButton;
                updatedChildren = [];
                if (newButton.length > 0) {
                    newButton.forEach((item) => {
                        updatedChildren.push({
                            id: item.id,
                            type: "Button",
                            props: { label: item.name, name: item.name, showBorder: false, type_button: item.type, style: item.style, size: item.size },
                            children: [],
                        },);
                    })
                }
            }
            if (dataField.some(n => n.id === selectedComponent.id)) {

                setDataField(dataField.map(n => {
                    if (n.id === selectedComponent.id) {
                        const newObj = { ...n, descript: updatedProps.descript, ...updatedProps };
                        return newObj
                    } else {
                        return n;
                    }
                }))
            }

            // Update tree với props + children mới
            const updatedTree = findAndUpdateComponent(
                layoutTree,
                selectedComponent.id,
                updatedProps,
                updatedChildren
            );

            setLayoutTree(updatedTree);

            // Sync lại selectedComponent sau khi save
            const updated = findComponentById(updatedTree, selectedComponent.id);
            if (updated) {
                setSelectedComponent(updated);
                setEditedComponentProps(updated.props);
            }

        }
    }, [selectedComponent, editedComponentProps, layoutTree]);



    const handleCancel = useCallback(() => {
        setSelectedComponent(null);
        setEditedComponentProps(null);
    }, []);

    return (
        <AppShell
            padding="0"
            style={{ display: 'flex', height: '100%', width: '100%', overflowY: "auto" }}
        >
            <Sidebar />
            <MainContent
                layoutTree={layoutTree}
                onDrop={handleDrop}
                onAddLayoutComponent={handleAddLayoutComponent}
                onSelectComponent={handleSelectComponent}
                onDeleteComponent={handleDelete}
                selectedComponent={selectedComponent}
            />
            <RightPanel
                selectedComponent={selectedComponent}
                editedComponentProps={editedComponentProps} // Pass edited props to the panel
                onPropertyChange={handlePropertyChange}
                onPropertyChangeC2={handlePropertyChangeList}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </AppShell>
    );
})

HomeFormBM.displayName = "HomeFormBM";
export default HomeFormBM;


// icon 

interface CustomIconProps extends RadioIconProps {
    column: string;
}

const Icon1Column: FC<CustomIconProps> = ({ column, ...props }) => {
    // You can use the `props` object here if needed, e.g., to change colors based on state
    return (
        <Box>
            <IconLayoutSidebarLeftCollapse size={48} style={{ opacity: column === '1_column' ? 1 : 0.2 }} />
        </Box>
    );
};
const Icon2Column: FC<CustomIconProps> = ({ column, ...props }) => {
    // You can use the `props` object here if needed, e.g., to change colors based on state
    return (
        <Box>
            <IconLayoutColumns size={48} style={{ opacity: column === '2_columns' ? 1 : 0.2 }} />
        </Box>
    );
};
const IconLeftRight: FC<RadioIconProps> = (props) => {
    // You can use the `props` object here if needed, e.g., to change colors based on state
    return (
        <svg width="60" height="60" viewBox="0 0 60 60">
            <path fill="none" stroke="#6C72E9" strokeLinecap="round" strokeWidth="2" d="M15 15h12v12h-12zM33 15h12v12h-12zM15 33h12v12h-12zM33 33h12v12h-12z" />
            <text x="21" y="22" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
            <text x="39" y="22" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
            <text x="21" y="40" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
            <text x="39" y="40" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">4</text>
        </svg>
    );
};
const IconTopBottom: FC<RadioIconProps> = (props) => {
    // You can use the `props` object here if needed, e.g., to change colors based on state
    return (
        <svg width="60" height="60" viewBox="0 0 60 60">
            <path fill="none" stroke="#6C72E9" strokeLinecap="round" strokeWidth="2" d="M15 15h12v12h-12zM33 15h12v12h-12zM15 33h12v12h-12zM33 33h12v12h-12z" />
            <text x="21" y="22" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
            <text x="39" y="22" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
            <text x="21" y="40" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
            <text x="39" y="40" fill="#6C72E9" fontSize="12" fontWeight="bold" textAnchor="middle">4</text>
        </svg>
    );
};

const iconProps = {
    stroke: 1.5,
    color: 'currentColor',
    opacity: 0.6,
    size: 18,
};

const icons: Record<string, React.ReactNode> = {
    VND: <span>🇻🇳</span>,
    USD: <span>🇺🇸</span>,
    EUR: <span>🇪🇺</span>,
    JPY: <span>🇯🇵</span>,
    GBP: <span>🇬🇧</span>,
    INR: <span>🇮🇳</span>,
};

const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
        {icons[option.value]}
        {option.label}
    </Group>
);
// utils: clone sâu nhưng giữ reference các cấp không thay đổi
function setDeep(obj: any, path: string, value: any) {
    const keys = path.replace(/\]/g, "").split(/[\[.]/); // "listButton[0].name" -> ["listButton","0","name"]

    // clone root
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
    let curr: any = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        // nếu chưa tồn tại, tạo object hoặc array rỗng
        if (curr[key] === undefined) {
            curr[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        } else {
            // clone từng cấp
            curr[key] = Array.isArray(curr[key]) ? [...curr[key]] : { ...curr[key] };
        }

        curr = curr[key];
    }

    // gán giá trị cuối cùng
    curr[keys[keys.length - 1]] = value;
    return newObj;
}
