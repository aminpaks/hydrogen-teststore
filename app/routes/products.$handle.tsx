import {useLoaderData} from '@remix-run/react';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import {LoaderArgs, json} from '@shopify/remix-oxygen';

export async function loader({params, context}: LoaderArgs) {
  const {handle} = params;
  const {product} = await context.storefront.query<{
    product: Product | undefined;
  }>(PRODUCT_QUERY, {
    variables: {
      handle,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return json({
    handle,
    product,
  });
}

export default function ProductHandle() {
  const {handle, product} = useLoaderData<{handle: string; product: Product}>();

  console.log(product.title);
  return (
    <div className="product-wrapper">
      <h2>Product Handle: {handle}</h2>
      <PrintJson data={{...product}} />
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
    }
  }
`;

function PrintJson({data}: {data: Product}) {
  return (
    <details className="outline outline-2 outline-blue-300 p-4 my-2">
      <summary>Product JSON</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}
