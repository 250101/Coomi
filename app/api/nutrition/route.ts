import { NextResponse } from "next/server"

const EDAMAM_APP_ID = "9d8cce9b"
const EDAMAM_API_KEY = "73cd91e8191e2f7208faeac48586a03d"
const EDAMAM_API_URL = "https://api.edamam.com/api/nutrition-details"

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 })
    }

    const response = await fetch(`${EDAMAM_API_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingr: ingredients }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Edamam API error:", errorData)
      return NextResponse.json(
        { error: "Failed to fetch nutrition data", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Procesar y formatear los datos nutricionales
    const processedData = {
      calories: data.calories,
      protein: Math.round(data.totalNutrients.PROCNT?.quantity || 0),
      fat: Math.round(data.totalNutrients.FAT?.quantity || 0),
      carbs: Math.round(data.totalNutrients.CHOCDF?.quantity || 0),
      fiber: Math.round(data.totalNutrients.FIBTG?.quantity || 0),
      sugar: Math.round(data.totalNutrients.SUGAR?.quantity || 0),
      fullNutrients: data.totalNutrients,
      detailedNutrients: [
        {
          label: "Saturated Fat",
          quantity: Math.round(data.totalNutrients.FASAT?.quantity || 0),
          unit: "g",
        },
        {
          label: "Trans Fat",
          quantity: Math.round(data.totalNutrients.FATRN?.quantity || 0),
          unit: "g",
        },
        {
          label: "Cholesterol",
          quantity: Math.round(data.totalNutrients.CHOLE?.quantity || 0),
          unit: "mg",
        },
        {
          label: "Sodium",
          quantity: Math.round(data.totalNutrients.NA?.quantity || 0),
          unit: "mg",
        },
        {
          label: "Calcium",
          quantity: Math.round(data.totalNutrients.CA?.quantity || 0),
          unit: "mg",
        },
        {
          label: "Iron",
          quantity: Math.round(data.totalNutrients.FE?.quantity || 0),
          unit: "mg",
        },
        {
          label: "Potassium",
          quantity: Math.round(data.totalNutrients.K?.quantity || 0),
          unit: "mg",
        },
      ],
    }

    return NextResponse.json(processedData)
  } catch (error) {
    console.error("Nutrition API error:", error)
    return NextResponse.json({ error: "Failed to process nutrition data" }, { status: 500 })
  }
}
