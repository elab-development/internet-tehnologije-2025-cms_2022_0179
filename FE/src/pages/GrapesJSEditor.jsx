import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { pagesAPI } from '../utils/api';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';

function GrapesJSEditor() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const siteId = searchParams.get('siteId');
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [pageData, setPageData] = useState(null);
    const isNewPage = !id;
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [pageType, setPageType] = useState('post');

    useEffect(() => {
        if (id) {
            loadPage();
        } else {
            setLoading(false);
            setPageData({
                title: '',
                slug: '',
                status: 'draft',
                page_type: 'post',
                content: '',
                draft_data: null
            });
        }
    }, [id]);

    useEffect(() => {
        if (!loading && editorRef.current && !editor) {
            initEditor();
        }
    }, [loading, pageData]);

    const loadPage = async () => {
        try {
            const page = await pagesAPI.getById(id);
            setPageData(page);
            setTitle(page.title);
            setSlug(page.slug);
            setPageType(page.page_type || 'post');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedMedia = async (currentEditor) => {
        if (!siteId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/media/site/${siteId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch media');
            const mediaList = await response.json();
            mediaList.forEach(item => {
                currentEditor.AssetManager.add(item.file_path);
            });
        } catch (err) {
            console.error('Error loading saved media:', err);
        }
    };

    const uploadToCloudinaryAndDB = async (file) => {
        const formData = new FormData();
        formData.append('siteId', siteId);
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/media', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            return data.file_path;
        } catch (err) {
            console.error('Upload error:', err);
            throw err;
        }
    };

    const initEditor = () => {
        if (editor) return;

        const grapesEditor = grapesjs.init({
            container: editorRef.current,
            fromElement: false,
            height: 'calc(100vh - 120px)',
            width: 'auto',
            storageManager: false,
            plugins: [gjsPresetWebpage],
            pluginsOpts: {
                [gjsPresetWebpage]: {
                    blocksBasicOpts: { flexGrid: true }
                }
            },
            assetManager: {
                upload: false,
                assets: [],
            },
            canvas: {
                scripts: ['https://cdn.tailwindcss.com']
            }
        });

        loadSavedMedia(grapesEditor);

        grapesEditor.on('asset:custom', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.multiple = true;
            fileInput.onchange = async (e) => {
                const files = e.target.files;
                for (let file of files) {
                    try {
                        const url = await uploadToCloudinaryAndDB(file);
                        grapesEditor.AssetManager.add({ src: url, name: file.name });
                    } catch (err) {
                        alert('Upload failed: ' + err.message);
                    }
                }
            };
            fileInput.click();
        });

        const bm = grapesEditor.BlockManager;

        bm.add('image', {
            label: 'Image',
            category: 'Basic',
            attributes: { class: 'gjs-fonts gjs-f-image' },
            content: { type: 'image' },
        });

        bm.add('picsum-random', {
            label: 'Random Photo',
            category: 'Basic',
            attributes: { class: 'gjs-fonts gjs-f-image' },
            content: `
                <img src="https://picsum.photos/800/600?random=${Math.floor(Math.random() * 10000)}" 
                     style="width: 100%; height: auto;" 
                     alt="Random Image"/>
            `
        });

        bm.add('columns2', {
            label: '2 Columns',
            category: 'Layout',
            content: `
                <div class="flex flex-wrap gap-4 p-4">
                    <div class="flex-1 min-w-[300px] p-8 border-2 border-dashed border-gray-200">Column 1</div>
                    <div class="flex-1 min-w-[300px] p-8 border-2 border-dashed border-gray-200">Column 2</div>
                </div>`,
        });

        bm.add('hero', {
            label: 'Hero Section',
            category: 'Components',
            content: `
                <section class="bg-blue-600 text-white py-20 px-4 text-center">
                    <h1 class="text-5xl font-bold mb-4">Hero Section</h1>
                    <p class="text-xl mb-8">Ready to work with Tailwind.</p>
                    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold">Get Started</button>
                </section>
            `,
        });

        if (pageData && !isNewPage) {
            if (pageData.draft_data) {
                try {
                    grapesEditor.loadProjectData(JSON.parse(pageData.draft_data));
                } catch (e) {
                    if (pageData.content) grapesEditor.setComponents(pageData.content);
                }
            } else if (pageData.content) {
                grapesEditor.setComponents(pageData.content);
            }
        }

        setEditor(grapesEditor);
    };

    const handleSave = async () => {
        if (!editor) return;

        const finalTitle = title.trim() || (pageData?.title || '');
        const finalSlug = slug.trim() || (pageData?.slug || '');

        if (!finalTitle) {
            setError('Please enter a page title');
            return;
        }

        if (!finalSlug) {
            setError('Please enter a page slug');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const html = editor.getHtml();
            const css = editor.getCss();
            const projectData = editor.getProjectData();

            const fullHtml = `
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>${css}</style>
                ${html}
            `;

            const pagePayload = {
                title: finalTitle,
                slug: finalSlug,
                page_type: pageType,
                content: fullHtml,
                draft_data: JSON.stringify(projectData),
                status: 'draft'
            };

            if (isNewPage) {
                pagePayload.site_id = siteId;
                await pagesAPI.create(pagePayload);
                alert('Page created!');
                navigate(`/sites/${siteId}/pages`);
            } else {
                await pagesAPI.update(id, pagePayload);
                alert('Page saved!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (isNewPage) {
            await handleSave();
            return;
        }
        try {
            await pagesAPI.publish(id);
            alert('Page published!');
            navigate(-1);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        console.log('Title changed to:', newTitle); // Debug log
        setTitle(newTitle);
        const newSlug = newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setSlug(newSlug);
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="h-screen flex flex-col">
            <div className="bg-white border-b px-4 py-3 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-4">
                        {isNewPage ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="Page Title"
                                    className="text-xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none w-full"
                                />
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="url-slug"
                                        className="text-sm text-gray-600 border px-2 py-1 rounded flex-1"
                                    />
                                    <select
                                        value={pageType}
                                        onChange={(e) => setPageType(e.target.value)}
                                        className="text-sm border px-2 py-1 rounded"
                                    >
                                        <option value="post">Post</option>
                                        <option value="home">Home</option>
                                        <option value="about">About</option>
                                        <option value="contact">Contact</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-xl font-bold">{pageData?.title}</h1>
                                <span className="text-sm text-gray-500">Status: {pageData?.status}</span>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        {!isNewPage && pageData?.status === 'draft' && (
                            <button
                                onClick={handlePublish}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                            >
                                Publish
                            </button>
                        )}
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                        {error}
                    </div>
                )}
            </div>
            <div ref={editorRef} className="flex-1" />
        </div>
    );
}

export default GrapesJSEditor;