import { useState, useEffect } from 'react'


export default function AdminPage() {
    const [form, setForm] = useState<any>({ imageKey: '' });

    const setFormValue = (key: string, value: string) => {
        setForm((prevState: any) => ({ ...prevState, [key]: value }));
    }

    const load = () => {
        if (form.imageKey) {
            setFormValue('hashcodes', '');
            fetch(`/api/admin/image/${form.imageKey}`)
                .then((res) => res.json())
                .then((res) => {
                    const hashcodes = res?.hashcodes?.join(',');
                    setFormValue('hashcodes', hashcodes);
                });
        }
    }

    const save = () => {
        if (form.imageKey) {
            const hashcodes = form.hashcodes.split(',').map((h: string) => h.trim());
            const data = {
                imageKey: form.imageKey,
                hashcodes,
                objectUrl: `https://website-happybirthday-images.s3.us-east-2.amazonaws.com/${form.imageKey}`,
            };
            fetch(`/api/admin/image/${form.imageKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
                .then(res => { })
                .catch(err => {
                    alert('Something bad happened. Please let me know.')
                });
        }
    }

    return (
        <div>
            <input type="text" value={form.imageKey} onChange={(e) => setFormValue('imageKey', e.target.value)} />
            <hr />

            <textarea name="body"
                onChange={(e) => setFormValue('hashcodes', e.target.value)}
                value={form?.hashcodes} />
            <hr />

            <input type="button" value="Load" disabled={!form.imageKey} onClick={load} />
            <input type="button" value="Save" disabled={!form.imageKey} onClick={save} />
        </div>
    )
}
