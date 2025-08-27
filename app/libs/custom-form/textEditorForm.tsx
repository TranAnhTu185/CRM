import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function TextEditor({
                                   value,
                                   onChange,
                               }: RichTextEditorProps) {
    const editor = useEditor({

        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <MantineRichTextEditor editor={editor}>
            <MantineRichTextEditor.Toolbar>
                <MantineRichTextEditor.ControlsGroup>
                    <MantineRichTextEditor.Bold />
                    <MantineRichTextEditor.Italic />
                </MantineRichTextEditor.ControlsGroup>
            </MantineRichTextEditor.Toolbar>

            <MantineRichTextEditor.Content />
        </MantineRichTextEditor>
    );
}