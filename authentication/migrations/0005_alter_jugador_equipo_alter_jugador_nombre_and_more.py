# Generated by Django 4.1.5 on 2023-02-19 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_jugador_posicion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jugador',
            name='equipo',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='jugador',
            name='nombre',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='jugador',
            name='posicion',
            field=models.CharField(default='banquillo', max_length=100),
        ),
    ]
