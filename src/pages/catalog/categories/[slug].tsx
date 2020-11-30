import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from 'next/link';
import { Document } from "prismic-javascript/types/documents";
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
interface CategoryProps {
    products: Document[];
    category: Document;
}

export default function Category({ category, products }: CategoryProps) {
    const router = useRouter();

    if (router.isFallback) {
        return <p>Carregando...</p>;
    }

    return (
    <div>
        <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>
        <ul>
            {products.map(product => {
                return (
                <li key={product.id}>
                    <Link href={`/catalog/products/${product.uid}`}>
                        {PrismicDOM.RichText.asText(product.data.title)}
                    </Link>
                </li>
                )
            })}
        </ul>
    </div>);
}

export const getStaticPaths: GetStaticPaths = async () => {
    const response = await fetch('http://localhost:3333/categories')
    const categories = await response.json();

    const paths = categories.map(category => ({
        params: {
            slug: category.id
        }
    }));

    return {
        paths,
        fallback: true,
    };
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {

    const { slug } = context.params;

    const category = await client().getByUID('category', String(slug), {});

    const products = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.at('my.product.category', category.id),
    ]);

    return {
        props: {
            products: products.results,
            category
        },
        revalidate: 60,
    }
}