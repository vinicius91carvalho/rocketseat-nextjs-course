import { GetServerSideProps } from 'next';
import React, { useCallback } from 'react';
import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({recommendedProducts}: HomeProps) {

  const handleSum = useCallback(async () => {
    const math = (await import('@/lib/math')).default;
    const total = math.sum(1, 2);
    console.log(process.env.NEXT_PUBLIC_API_URL, total);
  }, []);

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
            {recommendedProducts.map(recommendedProduct => {
              return (
                <li key={recommendedProduct.id}>
                  {recommendedProduct.title}
                </li>
              )
            })}
          </ul>
        </section>
        <button onClick={handleSum}>Soma</button>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`);
  const recommendedProducts = await response.json();
  
  return {
    props: {
      recommendedProducts
    }
  };
}
