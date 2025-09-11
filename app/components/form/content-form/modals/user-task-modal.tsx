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
} from '@mantine/core';
import {
    IconLink,
    IconClock,
    IconMail,
    IconPhone,
    IconFileText,
    IconToggleLeft,
    IconShape,
    IconCheck,
    IconCalendarEvent,
    IconEye,
    IconList,
    IconPlus,
    IconX,
    IconLineDashed,
    IconColumns,
    IconVector,
    IconArrowsMove,
    IconLayoutSidebarLeftCollapse,
    IconLayoutColumns,
} from '@tabler/icons-react';
import { useState, useMemo, useCallback, FC } from 'react';

// Define component data structure
interface ComponentProps {
    label?: string;
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    defaultValue?: any;
    // Add other properties here
}

interface ComponentData {
    id: string;
    type: string;
    children?: ComponentData[];
    props: ComponentProps;
}


type RightPanelProps = {
    selectedComponent: ComponentData | null;
    editedComponentProps: ComponentProps | null;
    onPropertyChange: (propName: keyof ComponentProps, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
};
// Function to check if a component can contain children
const isContainer = (type: string) => {
    return ['Layout Row', 'Layout Column', 'Section', 'Group'].includes(type);
};

// Component for the sidebar
const Sidebar = () => {
    const sidebarItems = [
        { label: "Layout Row", icon: <IconLineDashed size={16} /> },
        { label: "Layout Column", icon: <IconColumns size={16} /> },
        { label: "Section", icon: <IconShape size={16} /> },
        { label: "Group", icon: <IconVector size={16} /> },
        { label: "Văn bản dài", icon: <IconFileText size={16} /> },
        { label: "Đường dẫn liên kết", icon: <IconLink size={16} /> },
        { label: "Số", icon: <IconShape size={16} /> },
        { label: "Tải lên tệp tin", icon: <IconFileText size={16} /> },
        { label: "Phần trăm", icon: <IconShape size={16} /> },
        { label: "Tiền tệ", icon: <IconShape size={16} /> },
        { label: "Thời gian", icon: <IconClock size={16} /> },
        { label: "Email", icon: <IconMail size={16} /> },
        { label: "Nhãn", icon: <IconToggleLeft size={16} /> },
        { label: "Số điện thoại", icon: <IconPhone size={16} /> },
        { label: "Biểu thức chính quy", icon: <IconShape size={16} /> },
        { label: "Boolean", icon: <IconCheck size={16} /> },
        { label: "Cờ lưu trữ", icon: <IconCalendarEvent size={16} /> },
        { label: "Display text", icon: <IconEye size={16} /> },
        { label: "Danh sách lựa chọn", icon: <IconList size={16} /> },
    ];

    return (
        <Box w={300} p="md" bg="gray.1" style={{ borderRight: '1px solid var(--mantine-color-gray-3)' }}>
            <Title order={3} mb="lg">
                Thiết lập biểu mẫu
            </Title>
            <Stack gap="xs">
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
            </Stack>
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
            let color = 'blue';
            let title = item.type;
            let childrenWrapper;
            switch (item.type) {
                case 'Layout Column': color = 'green'; break;
                case 'Group': color = 'red'; break;
                case 'Section': color = 'grape'; break;
            }

            if (item.children && item.children.length > 0) {
                if (item.type === 'Group') {
                    childrenWrapper = (
                        <Flex
                            gap="md"
                            wrap="wrap"
                            style={{
                                '--mantine-flex-item-basis': 'calc(50% - var(--mantine-spacing-md) / 2)',
                            }}
                        >
                            {item.children.map((child) => (
                                <Box key={child.id} style={{ flexGrow: 1, flexBasis: 'calc(50% - var(--mantine-spacing-md) / 2)' }}>
                                    {renderComponent(child)}
                                </Box>
                            ))}
                        </Flex>
                    );
                } else {
                    childrenWrapper = (
                        <Stack gap="md">
                            {item.children.map((child) => (
                                <Box key={child.id}>
                                    {renderComponent(child)}
                                </Box>
                            ))}
                        </Stack>
                    );
                }
            } else {
                childrenWrapper = (
                    <Text ta="center" fz="sm" c="gray.5" style={{ minHeight: '50px' }}>
                        Kéo thả các thành phần vào đây
                    </Text>
                );
            }

            return (
                <Paper
                    withBorder
                    p="md"
                    style={{
                        borderColor: `var(--mantine-color-${color}-4)`,
                        boxShadow: isSelected ? `0 0 0 2px var(--mantine-color-blue-5)` : isDragOver ? `0 0 0 2px var(--mantine-color-teal-5)` : 'none',
                        borderStyle: isDragOver ? 'dashed' : 'solid',
                    }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragEnter={(e) => { e.stopPropagation(); setDragOverId(item.id); }}
                    onDragLeave={(e) => { e.stopPropagation(); setDragOverId(null); }}
                    onDrop={(e) => { onDrop(e, item.id); setDragOverId(null); }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectComponent(item);
                    }}
                >
                    <Group justify="space-between" align="center" mb="xs">
                        <Group gap="xs">
                            <IconArrowsMove size={16} />
                            <Text fz="sm" c={`${color}.5`}>{title}</Text>
                        </Group>
                        <ActionIcon variant="transparent" color="gray" onClick={(e) => {
                            e.stopPropagation();
                            onDeleteComponent(item.id);
                        }}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                    {childrenWrapper}
                </Paper>
            );
        }

        // Render input components
        switch (item.type) {
            case "Văn bản dài":
            case "Đường dẫn liên kết":
            case "Email":
            case "Số điện thoại":
            case "Biểu thức chính quy":
            case "Display text":
                componentToRender = <TextInput placeholder={item.props.placeholder || item.type} label={item.props.label} readOnly={item.props.readOnly} />;
                break;
            case "Số":
            case "Phần trăm":
            case "Tiền tệ":
                componentToRender = <NumberInput placeholder={item.props.placeholder || item.type} label={item.props.label} readOnly={item.props.readOnly} />;
                break;
            case "Boolean":
                componentToRender = <Checkbox label={item.props.label || item.type} readOnly={item.props.readOnly} />;
                break;
            case "Danh sách lựa chọn":
                componentToRender = <Select placeholder={item.props.placeholder || item.type} data={['Tùy chọn 1', 'Tùy chọn 2']} label={item.props.label} />;
                break;
            case "Thời gian":
                componentToRender = <TextInput placeholder={item.props.placeholder || item.type} type="time" label={item.props.label} readOnly={item.props.readOnly} />;
                break;
            default:
                componentToRender = <Text>{item.type} - Không hỗ trợ xem trước</Text>;
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
                <Group justify="space-between" align="center">
                    <Group gap="xs">
                        <IconArrowsMove size={16} />
                        <Text fw="bold">{item.type}</Text>
                    </Group>
                    <ActionIcon variant="transparent" color="gray" onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComponent(item.id);
                    }}>
                        <IconX size={16} />
                    </ActionIcon>
                </Group>
                <Divider my="sm" />
                {componentToRender}
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
            style={{ minHeight: '100vh', position: 'relative', border: dragOverId === "main-content-root" ? '2px dashed var(--mantine-color-teal-5)' : '2px dashed transparent' }}
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
const RightPanel = ({ selectedComponent, editedComponentProps, onPropertyChange, onSave, onCancel }) => {
    if (!selectedComponent) {
        return (
            <Box w={300} p="md" bg="white" style={{ borderLeft: '1px solid var(--mantine-color-gray-3)' }}>
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


        </>
    );

    const renderTextFieldProps = () => (
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
            <Box mt="xs">
                <Text fz="sm" fw="bold" mb="xs">Văn bản gợi ý</Text>
                <TextInput
                    placeholder="Nhập văn bản gợi ý"
                    value={editedComponentProps?.placeholder ?? ''}
                    onChange={(e) => onPropertyChange('placeholder', e.currentTarget.value)}
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
        </>
    );

    const renderNumberFieldProps = () => (
        <>
            {renderTextFieldProps()}
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
        </>
    );

    const renderSelectProps = () => (
        <>
            {renderTextFieldProps()}
            <Box mt="xs">
                <Text fz="sm" fw="bold" mb="xs">Tùy chọn</Text>
                <Button leftSection={<IconPlus size={16} />} variant="outline" fullWidth>Thêm tùy chọn</Button>
            </Box>
        </>
    );

    const renderProperties = () => {
        if (isContainer(t)) return renderContainerProps();

        switch (t) {
            case 'Văn bản dài':
            case 'Đường dẫn liên kết':
            case 'Email':
            case 'Số điện thoại':
            case 'Biểu thức chính quy':
            case 'Display text':
                return renderTextFieldProps();

            case 'Số':
            case 'Phần trăm':
            case 'Tiền tệ':
                return renderNumberFieldProps();

            case 'Boolean':
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

            case 'Danh sách lựa chọn':
                return renderSelectProps();

            case 'Thời gian':
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
                    </>
                );

            default:
                return <Text ta="center" mt="md">Chưa có thuộc tính cho loại component này.</Text>;
        }
    };

    return (
        <Box w={300} p="md" bg="white" style={{ borderLeft: '1px solid var(--mantine-color-gray-3)' }}>
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
const findAndUpdateComponent = (tree: ComponentData[], id: string, newProps: ComponentProps): ComponentData[] => {
    return tree.map(node => {
        if (node.id === id) {
            return { ...node, props: newProps };
        }
        if (node.children) {
            const updatedChildren = findAndUpdateComponent(node.children, id, newProps);
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

// Main component
export default function Home() {
    const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null);
    const [editedComponentProps, setEditedComponentProps] = useState<ComponentProps | null>(null);

    const createComponent = useCallback((type: string, children?: ComponentData[]): ComponentData => {
        let props: ComponentProps = {};
        if (type === 'Văn bản dài' || type === 'Số' || type === 'Boolean' || type === 'Danh sách lựa chọn' || type === 'Thời gian' || type === 'Đường dẫn liên kết' || type === 'Email' || type === 'Số điện thoại' || type === 'Biểu thức chính quy' || type === 'Display text') {
            props = {
                label: type,
                placeholder: `Nhập ${type}`,
                required: false,
                readOnly: false,
            };
        }
        return {
            id: `${type}-${crypto.randomUUID()}`,
            type,
            children: isContainer(type) ? (children || []) : undefined,
            props,
        };
    }, []);

    const initialNestedLayout: ComponentData[] = useMemo(() => [
        createComponent('Layout Row', [
            createComponent('Layout Column', [
                createComponent('Section', [
                    createComponent('Group', [])
                ])
            ])
        ])
    ], [createComponent]);

    const [layoutTree, setLayoutTree] = useState<ComponentData[]>(initialNestedLayout);

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

    const handlePropertyChange = useCallback((propName: keyof ComponentProps, value: any) => {
        setEditedComponentProps(prevProps => prevProps ? { ...prevProps, [propName]: value } : null);
    }, []);

    const handleSave = useCallback(() => {
        debugger;
        if (selectedComponent && editedComponentProps) {
            const updatedTree = findAndUpdateComponent(layoutTree, selectedComponent.id, editedComponentProps);
            setLayoutTree(updatedTree);

            const newlySelectedComponent = findComponentById(updatedTree, selectedComponent.id);
            if (newlySelectedComponent) {
                setSelectedComponent(newlySelectedComponent);
                setEditedComponentProps(newlySelectedComponent.props);
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
            style={{ display: 'flex', minHeight: '100vh' }}
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
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </AppShell>
    );
}


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
