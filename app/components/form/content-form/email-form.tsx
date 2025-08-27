"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    TagsInput,
    FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import {Link, RichTextEditor} from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import {useEditor} from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import {IconFileZip} from "@tabler/icons-react";

const EmailForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const icon = <IconFileZip size={18} stroke={1.5} />;
    const [name, setName] = useState("");
    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            if (form.isValid()) {
                onSubmit(form.values);
            }
        },
    }));


    const form = useForm({
        initialValues: {
            name: "",
            slug: "",
            emailSubject: "",
            to: [],
            cc: [],
            bcc: [],
            textType: "",
            emailContent: "",
            body: "",
            file: "",
            description: "",
            from: "",
            direction: "asc", // asc: từ đầu đến cuối, desc: từ cuối đến đầu
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            slug: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            from: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            emailSubject: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            textType: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            emailContent: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

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
        immediatelyRender:false,
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
                    value={name}
                    onChange={(e) => {
                        setName(e.currentTarget.value);
                        form.setFieldValue("name", e.currentTarget.value);
                    }}
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
                {/*Slug*/}
                <TextInput
                    required
                    label="Slug"
                    placeholder="Nhập..."
                    mt="sm"
                    {...form.getInputProps('slug')}
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
                />
                {/*Người nhận*/}
                <TagsInput
                    required
                    label="Người nhận"
                    placeholder="Nhập người nhận..."
                    maxTags={3}
                    defaultValue={[]}
                    mt="sm"
                    {...form.getInputProps('to')}/>
                {/*cc*/}
                <TagsInput
                    label="CC"
                    placeholder="CC..."
                    maxTags={3}
                    defaultValue={[]}
                    mt="sm"
                    {...form.getInputProps('cc')}/>
                {/*bcc*/}
                <TagsInput
                    label="BCC"
                    placeholder="BCC..."
                    maxTags={3}
                    defaultValue={[]}
                    mt="sm"
                    {...form.getInputProps('bcc')}/>

                {/*loại văn bản*/}
                <Select
                    required
                    label="Loại văn bản"
                    placeholder="Chọn..."
                    mt="sm"
                    data={[
                        { value: "1", label: 'Loại 1' },
                        { value: "2", label: 'Loại 2' },
                    ]}
                    {...form.getInputProps('textType')}
                />

                <RichTextEditor   mt="sm" {...form.getInputProps('body')} editor={editor}>
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
