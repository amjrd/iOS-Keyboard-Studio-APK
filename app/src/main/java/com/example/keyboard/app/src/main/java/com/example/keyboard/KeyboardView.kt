package com.example.keyboard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun KeyboardView(
    onKeyPress: (String) -> Unit,
    onDelete: () -> Unit
) {
    val row1 = listOf("q", "w", "e", "r", "t", "y", "u", "i", "o", "p")
    val row2 = listOf("a", "s", "d", "f", "g", "h", "j", "k", "l")
    val row3 = listOf("z", "x", "c", "v", "b", "n", "m")

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFD1D5DB))
            .padding(vertical = 8.dp)
    ) {
        KeyboardRow(keys = row1, onKeyPress = onKeyPress)
        KeyboardRow(keys = row2, onKeyPress = onKeyPress)

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            row3.forEach { key ->
                KeyButton(text = key, modifier = Modifier.weight(1f)) {
                    onKeyPress(key)
                }
            }
            KeyButton(
                text = "⌫", 
                modifier = Modifier.weight(1.5f), 
                backgroundColor = Color(0xFFA2A9B4)
            ) {
                onDelete()
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp, horizontal = 12.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            KeyButton(
                text = "space",
                modifier = Modifier.fillMaxWidth(0.6f),
                backgroundColor = Color.White
            ) {
                onKeyPress(" ")
            }
        }
    }
}

@Composable
fun KeyboardRow(keys: List<String>, onKeyPress: (String) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        keys.forEach { key ->
            KeyButton(text = key, modifier = Modifier.weight(1f)) {
                onKeyPress(key)
            }
        }
    }
}

@Composable
fun KeyButton(
    text: String,
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color.White,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .padding(horizontal = 2.dp)
            .height(48.dp)
            .background(backgroundColor, shape = RoundedCornerShape(5.dp))
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(text = text, fontSize = 18.sp, color = Color.Black)
    }
}
