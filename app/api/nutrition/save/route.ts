import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Inicializar el cliente de Supabase
const supabaseUrl = "https://zoibvmfuvzbmwirtubwa.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaWJ2bWZ1dnpibXdpcnR1YndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzUzMTYsImV4cCI6MjA2MjIxMTMxNn0.s3-qHzeb8Hrx0EXpo8MGxGFGOhD1QmIQpGBbJ3Sunmg"
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const nutritionData = await request.json()

    // Validar datos mínimos requeridos
    if (!nutritionData.recipe_id || !nutritionData.recipe_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insertar datos en Supabase
    const { data, error } = await supabase
      .from("nutrition_data")
      .upsert({
        recipe_id: nutritionData.recipe_id,
        recipe_name: nutritionData.recipe_name,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        fat: nutritionData.fat,
        carbs: nutritionData.carbs,
        fiber: nutritionData.fiber,
        full_nutrients: nutritionData.full_nutrients,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to save nutrition data", details: error }, { status: 500 })
    }

    return NextResponse.json({
      message: "Nutrition data saved successfully",
      data,
    })
  } catch (error) {
    console.error("Save nutrition API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
