import { GetServerSideProps } from 'next';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrimiscDOM from 'prismic-dom';
interface IProduct {
  id: string;
  title: string;
}
interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({recommendedProducts}: HomeProps) {
  return (
    <>
      <SEO 
        title="DevCommerce, your top e-commerce!"
        image="https://rocketseat.com.br/og/boost.png"
        shouldExcludeTitleSuffix
      />
      <div>
        <section>
          <Title>Products</Title>
          <ul>
            {
              recommendedProducts.map(recommendedProduct => {
                return (
                  <li key={recommendedProduct.id}>
                    <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                        {PrimiscDOM.RichText.asText(recommendedProduct.data.title)}
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </section>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {

  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);
  
  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  };
}
