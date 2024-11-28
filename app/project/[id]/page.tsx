import { promises as fs } from 'fs';
import { Project } from '../../../models/projectModel';

async function getProjectData(id: string) {
    const file = await fs.readFile(process.cwd() + '/app/project/data.json', 'utf8');
    const data: { data: Project[] } = JSON.parse(file);
    const project = data.data.find((project) => project.id === Number(id))
    if (!project) {
        throw new Error("Project not found.");
    }
    return project;
}

export async function generateStaticParams() {
    const file = await fs.readFile(process.cwd() + '/app/project/data.json', 'utf8');
    const data: { data: Project[] } = JSON.parse(file);
    const project = data.data;
    return project.map((project: Project) => ({
        id: project.id.toString()
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectData(id);
    if (!project) {
        return <p>Project not found</p>;
    } else {
        return (
            <main className="py-20">
                <section className="py-20">
                    <div className="container mx-auto">
                        <h2 className="text-4xl font-bold mb-4">{project.title}</h2>
                        <p className="text-xl mb-8">{project.description}</p>
                    </div>
                    <div className="text-center">
                        <img src={project.img} width={300} height={300} alt={project.title} />
                    </div>
                    <div className="container mx-auto py-10">
                        {(await project.content).map((content, index) => (
                            <p key={index} className="mb-4 contain-content">{content}</p>
                        ))}
                        <p className="mb-4">
                            Read more at <a href={project.link} target="_blank">Github</a>
                        </p>
                    </div>
                </section>
            </main>
        );
    }
}
