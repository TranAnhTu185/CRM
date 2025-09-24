"use client";

import { forwardRef, use, useEffect, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    TagsInput,
    FileInput,
    Title,
    Group,
    Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import { Link, RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import { IconFileZip } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

const EmailForm = forwardRef<childProps, ChildFormProps>(({ data, onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);
    const [showReplyTo, setShowReplyTo] = useState(false);

    const icon = <IconFileZip size={18} stroke={1.5} />;
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
                emailSubject: data.info.emailSubject,
                to: data.info.to,
                cc: data.info.cc,
                bcc: data.info.bcc,
                replyTo: data.info.replyTo,
                textType: data.info.textType,
                emailContent: data.info.emailContent,
                title: data.info.title,
                body: data.info.body,
                file: data.info.file,
                description: data.info.description,
                from: data.info.from,
            });
        }
    }

    useEffect(() => {
        initData();
    }, [data])


    const form = useForm({
        initialValues: {
            name: "",
            emailSubject: "",
            to: [],
            cc: [],
            bcc: [],
            replyTo: [],
            textType: "1",
            emailContent: "1",
            title: "",
            body: "",
            file: "",
            description: "",
            from: "",

        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            from: (value) =>
                value.trim().length < 1 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            // k thay sd field nay gay loi k submit form duoc
            // emailSubject: (value) =>
            //     value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            textType: (value) =>
                value.trim().length < 1 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            emailContent: (value) =>
                value.trim().length < 1 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        immediatelyRender: false,
        onUpdate({ editor }) {
            form.setFieldValue('body', editor.getHTML());
        },
        content: form.values.body, // Initialize editor with form value
    });

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
                            {form.values.name.length}/{maxNameLength}
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
                <span className={'font-bold'}>Thiết lập Email</span>

                <Title order={3} mb="md">
                    Cấu hình Email
                </Title>

                {/* Các link toggle */}
                <Group gap="lg" mb="sm">
                    <Button variant="subtle" size="xs" onClick={() => setShowCc((v) => !v)}>
                        Cc
                    </Button>
                    <Button variant="subtle" size="xs" onClick={() => setShowBcc((v) => !v)}>
                        Bcc
                    </Button>
                    <Button variant="subtle" size="xs" onClick={() => setShowReplyTo((v) => !v)}>
                        Reply-to
                    </Button>
                </Group>
                {/*Người gửi*/}
                <Select
                    required
                    label="Người gửi"
                    placeholder="Chọn người gửi..."
                    mt="sm"
                    data={[
                        { value: "1", label: 'Ông A' },
                        { value: "2", label: 'Bà B' },
                    ]}
                    {...form.getInputProps('from')}
                    withAsterisk
                />
                {/*Người nhận*/}
                <TagsInput
                    required
                    label="To"
                    placeholder="Nhập email người nhận..."
                    maxTags={3}
                    defaultValue={[]}
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('to')} />
                {/*cc*/}
                {showCc && (<TagsInput
                    label="Cc"
                    placeholder="Cc..."
                    maxTags={3}
                    defaultValue={[]}
                    mt="sm"
                    {...form.getInputProps('cc')} />
                )}
                {/*bcc*/}
                {showBcc && (<TagsInput
                    label="Bcc"
                    placeholder="Bcc..."
                    maxTags={3}
                    defaultValue={[]}
                    mt="sm"
                    {...form.getInputProps('bcc')} />
                )}

                {showReplyTo && (<TagsInput
                    label="Reply-to"
                    placeholder="ReplyTo..."
                    maxTags={3}
                    defaultValue={[]}
                    mt="sm"
                    {...form.getInputProps('replyTo')} />
                )}
                {/*Tiêu đề email*/}
                <TextInput
                    required
                    label="Tiêu đề email"
                    placeholder="Nhập..."
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('title')}
                />

                {/*loại văn bản*/}
                <Select
                    required
                    label="Loại văn bản"
                    placeholder="Chọn..."
                    mt="sm"
                    withAsterisk
                    data={[
                        { value: "1", label: 'Văn bản có định dạng' },
                        { value: "2", label: 'Văn bản thuần' },
                    ]}
                    {...form.getInputProps('textType')}
                />

                {/*Nội dung email*/}
                <Select
                    required
                    label="Nội dung email"
                    placeholder="Chọn..."
                    mt="sm"
                    withAsterisk
                    data={[
                        { value: "1", label: 'Nhập nội dung thủ công' },
                        { value: "2", label: 'Sử dụng mẫu văn bản' },
                        { value: "3", label: 'Sử dụng tài nguyên hoặc biến khác' },
                    ]}
                    {...form.getInputProps('emailContent')}
                />

                {form.values.emailContent === "1" && <RichTextEditor mt="sm" {...form.getInputProps('body')} editor={editor}
                    styles={{
                        content: {
                            minHeight: 200,   // Chiều cao ban đầu (px)
                        },
                    }}
                >
                    <RichTextEditor.Toolbar>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>
                }

                {/*file*/}
                <FileInput
                    leftSection={icon}
                    label="Tệp đính kèm"
                    placeholder="Chọn tệp đính kèm"
                    leftSectionPointerEvents="none"
                    {...form.getInputProps('file')}
                    mt="sm"
                />

            </form>
        </Box>
    );
});


EmailForm.displayName = "EmailForm";
export default EmailForm;
