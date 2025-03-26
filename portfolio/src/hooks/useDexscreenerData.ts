import { useEffect, useState } from "react";

import { PairData, DexscreenerResponse } from "../types/dexscreener";

const useDexscreenerData = (chainId: string, tokenAddresses: string) => {

    const [dexscreenerData, setDexscreenerData] = useState<PairData | null>(null);

    useEffect(() => {
        const fetchDexscreenerData = async () => {
            const response = await fetch(`http://localhost:5173/api/dexscreener/${chainId}/${tokenAddresses}`);
            const data: DexscreenerResponse = await response.json();
            setDexscreenerData(data[0]);
        }

        fetchDexscreenerData().catch(console.error);
    }, [chainId, tokenAddresses]);

    return { dexscreenerData };
}

export default useDexscreenerData;